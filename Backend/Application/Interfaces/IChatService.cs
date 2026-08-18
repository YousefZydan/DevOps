using Application.Dtos;
using Application.Helpers;

namespace Application.Interfaces;

public interface IChatService
{
    Task<Result<ChatTriageResponse>> TriageAsync(ChatTriageRequest request, CancellationToken cancellationToken);
}
