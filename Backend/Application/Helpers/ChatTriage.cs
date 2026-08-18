using System.Text.RegularExpressions;

namespace Application.Helpers;

public static class ChatTriage
{
    public static readonly string[] Specialties =
    [
        "Dentistry",
        "Cardiology",
        "Pulmonology",
        "General",
        "Neurology",
        "Gastroenterology",
        "Laboratory",
        "Vaccination"
    ];

    public static string SystemPrompt =>
        """
        You are a friendly triage assistant for a healthcare booking app. Your job is to ask the patient short, simple follow-up questions about their symptoms (one or two at a time, not a long list) until you are confident enough to recommend which medical specialty they should book.

        You must only recommend one of these specialties: Dentistry, Cardiology, Pulmonology, General, Neurology, Gastroenterology, Laboratory, Vaccination.

        Rules:
        - Keep replies short and conversational, like a helpful receptionist, not a doctor giving a diagnosis.
        - Ask at most 2-3 follow-up questions before giving a recommendation.
        - When you are ready to recommend, end your message with a separate final line in exactly this format: "Recommended specialty: <one of the list above>".
        - Never attempt to diagnose a condition, prescribe treatment, or give medical advice beyond pointing to the right specialty.
        - If the patient describes anything that sounds like a medical emergency (e.g. chest pain, difficulty breathing, severe bleeding, stroke symptoms), tell them to seek emergency care immediately instead of recommending a specialty.
        """;

    public static string? ExtractSpecialty(string text)
    {
        if (string.IsNullOrWhiteSpace(text))
        {
            return null;
        }

        var match = Regex.Match(text, @"Recommended specialty:\s*([A-Za-z]+)", RegexOptions.IgnoreCase);
        if (!match.Success)
        {
            return null;
        }

        var found = Specialties.FirstOrDefault(s =>
            s.Equals(match.Groups[1].Value.Trim(), StringComparison.OrdinalIgnoreCase));
        return found;
    }
}
