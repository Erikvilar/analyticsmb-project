export function tokenizePrompt(prompt: string): string[] {
    const regex = /"([^"]*)"|'([^']*)'|(\S+)/g;
    const tokens: string[] = [];
    let match;

    while ((match = regex.exec(prompt)) !== null) {
        // match[1] = conteúdo entre aspas duplas, match[2] = aspas simples, match[3] = token solto
        tokens.push(match[1] ?? match[2] ?? match[3]);
    }

    return tokens;
}
