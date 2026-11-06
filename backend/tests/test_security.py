from app.security import hash_password, verify_password


def test_password_is_hashed():
    password = "ExamPilotSecure@2026"
    hashed = hash_password(password)

    assert hashed != password
    assert hashed.startswith("$argon2")


def test_correct_password_is_accepted():
    password = "ExamPilotSecure@2026"
    hashed = hash_password(password)

    assert verify_password(password, hashed) is True


def test_incorrect_password_is_rejected():
    hashed = hash_password("ExamPilotSecure@2026")

    assert verify_password("WrongPassword123", hashed) is False


def test_password_hashes_use_unique_salts():
    password = "ExamPilotSecure@2026"

    first_hash = hash_password(password)
    second_hash = hash_password(password)

    assert first_hash != second_hash
    assert verify_password(password, first_hash)
    assert verify_password(password, second_hash)
