using Application.Dtos;
using Application.Validators;
using Domain.Enums;
using FluentValidation.TestHelper;
using Xunit;

namespace Clinic.Tests;

public class RegisterDtoValidatorTests
{
    private readonly RegisterDtoValidator _validator = new();

    [Fact]
    public void Rejects_empty_email()
    {
        var dto = Valid();
        dto.Email = "";
        var result = _validator.TestValidate(dto);
        result.ShouldHaveValidationErrorFor(x => x.Email);
    }

    [Fact]
    public void Rejects_mismatched_passwords()
    {
        var dto = Valid();
        dto.ConfirmPassword = "Different1!";
        var result = _validator.TestValidate(dto);
        result.ShouldHaveValidationErrorFor(x => x.ConfirmPassword);
    }

    [Fact]
    public void Accepts_a_valid_registration()
    {
        var result = _validator.TestValidate(Valid());
        result.ShouldNotHaveAnyValidationErrors();
    }

    private static RegisterDto Valid() => new()
    {
        Name = "Youssef Test",
        Nickname = "Yoyo",
        Email = "youssef@example.com",
        UserName = "youssef",
        Password = "P@ssword1",
        ConfirmPassword = "P@ssword1",
        Phone = "+201000000000",
        DateOfBirth = new DateTime(1995, 1, 1),
        Gender = Gender.Male
    };
}
