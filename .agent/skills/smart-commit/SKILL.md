---
name: Smart Commit
description: Generates atomic documentation and commit messages from staged changes.
---

# Smart Commit Skill

Use this skill when asked to execute a "smart commit", "commit", or document staged changes. This workflow is designed to be atomic and context-aware.

## Instructions

1.  **Capture Staged Changes**:
    *   Execute: `git diff --cached > .diff_tmp`
    *   *Note*: Only analyze staged changes.

2.  **Analyze Context**:
    *   Read the temporary diff file using `view_file .diff_tmp`.
    *   **CRITICAL**: Do not just list filenames. Analyze the *code changes* to understand the **responsibility** and **purpose** of each component.
    *   *Self-Correction*: If you find yourself writing "Add file X", stop. Ask "What does file X do?". Write that instead.

3.  **Generate Documentation**:
    *   Create a markdown file in `docs/commits/` named after the change (e.g., `docs/commits/feat-user-login.md`).
    *   **Content**:
        *   Title: Descriptive title of the change (**in Spanish**).
        *   Date: Current date.
        *   Affected Files: Bulleted list.
        *   Detailed Description: Explanation of *why* and *what* changed (**in Spanish**).
        *   Generated Commit Message: The proposed message (**in Spanish**).
        *   *Examples*:
            *   *Bad*: "- Añadir SessionsService"
            *   *Good*: "- Añadir `SessionsService` para orquestar la lógica de negocio de sesiones."

4.  **Present Commit Message**:
    *   Format: `<emoji> <type>(<scope>): <description>` (**in Spanish, imperative mood**).
    *   Body: Bulleted list of context-aware changes (**in Spanish**). Explain the **role** of the component.
        *   *Bad*: "- Añadir SessionsKafkaController"
        *   *Good*: "- Añadir `SessionsKafkaController` para manejar eventos de entrada desde el bus de mensajes."
    *   **Do not commit** automatically. Ask the user if they want to proceed with `git commit -F docs/commits/...` or manual entry.

5.  **Cleanup**:
    *   Remove the temporary file: `Remove-Item .diff_tmp`

## Conventional Commits Reference

| Emoji | Type | Description |
| :--- | :--- | :--- |
| ✨ | feat | New feature |
| 🐛 | fix | Bug fix |
| ♻️ | refactor | Code change that neither fixes a bug nor adds a feature |
| 📚 | docs | Documentation only changes |
| 🚀 | perf | A code change that improves performance |
| 🔧 | chore | Other changes that don't modify src or test files |
