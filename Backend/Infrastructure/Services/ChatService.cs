using System.Net.Http.Json;
using System.Text.Json;
using Application.Dtos;
using Application.Helpers;
using Application.Interfaces;
using Microsoft.Extensions.Configuration;

namespace Infrastructure.Services;

public class ChatService(HttpClient http, IConfiguration configuration) : IChatService
{
    public async Task<Result<ChatTriageResponse>> TriageAsync(ChatTriageRequest request, CancellationToken cancellationToken)
    {
        var apiKey = configuration["Groq:ApiKey"];
        if (string.IsNullOrWhiteSpace(apiKey))
        {
            return Result<ChatTriageResponse>.Fail("Chat assistant is not configured.");
        }

        var history = request.Messages
            .Where(m => m.Role is "user" or "assistant" && !string.IsNullOrWhiteSpace(m.Content))
            .Select(m => new { role = m.Role, content = m.Content.Trim() })
            .ToList();

        var payload = new
        {
            model = configuration["Groq:Model"] ?? "llama-3.3-70b-versatile",
            temperature = 0.4,
            messages = new object[] { new { role = "system", content = ChatTriage.SystemPrompt } }
                .Concat(history)
                .ToArray()
        };

        using var groqRequest = new HttpRequestMessage(HttpMethod.Post, "openai/v1/chat/completions")
        {
            Content = JsonContent.Create(payload)
        };
        groqRequest.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", apiKey);

        using var response = await http.SendAsync(groqRequest, cancellationToken);
        var body = await response.Content.ReadAsStringAsync(cancellationToken);
        if (!response.IsSuccessStatusCode)
        {
            return Result<ChatTriageResponse>.Fail("The assistant is temporarily unavailable.");
        }

        using var document = JsonDocument.Parse(body);
        var reply = document.RootElement
            .GetProperty("choices")[0]
            .GetProperty("message")
            .GetProperty("content")
            .GetString()
            ?.Trim();

        if (string.IsNullOrWhiteSpace(reply))
        {
            reply = "Sorry, I didn't catch that. Could you rephrase?";
        }

        return Result<ChatTriageResponse>.Success(new ChatTriageResponse
        {
            Reply = reply,
            Specialty = ChatTriage.ExtractSpecialty(reply)
        });
    }
}
