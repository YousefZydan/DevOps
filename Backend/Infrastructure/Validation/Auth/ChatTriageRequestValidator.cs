using Application.Dtos;
using FluentValidation;

namespace Application.Validators;

public class ChatTriageRequestValidator : AbstractValidator<ChatTriageRequest>
{
    public ChatTriageRequestValidator()
    {
        RuleFor(x => x.Messages)
            .NotEmpty().WithMessage("At least one message is required")
            .Must(m => m.Count <= 20).WithMessage("Too many messages");

        RuleForEach(x => x.Messages).ChildRules(message =>
        {
            message.RuleFor(m => m.Role)
                .Must(role => role is "user" or "assistant")
                .WithMessage("Role must be user or assistant");

            message.RuleFor(m => m.Content)
                .NotEmpty()
                .MaximumLength(2000);
        });
    }
}
