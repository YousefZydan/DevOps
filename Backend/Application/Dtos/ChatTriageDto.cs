namespace Application.Dtos;

public class ChatTriageRequest
{
    public List<ChatMessageDto> Messages { get; set; } = [];
}

public class ChatMessageDto
{
    public string Role { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
}

public class ChatTriageResponse
{
    public string Reply { get; set; } = string.Empty;
    public string? Specialty { get; set; }
}
