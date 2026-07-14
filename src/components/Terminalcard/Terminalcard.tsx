import { useState, useRef, useEffect } from "react";

import "./Terminalcard.css";
import useTerminalData from "../../hooks/useTerminalData.ts";

interface TerminalCardProps {
    title?: string;
}

export default function TerminalCard({ title = "Terminal" }: TerminalCardProps) {

    const { lines, handleInput, isLoading } = useTerminalData();
    const [inputValue, setInputValue] = useState("");

    // histórico de comandos digitados (só os comandos, não o output)
    const [history, setHistory] = useState<string[]>([]);
    const historyIndexRef = useRef<number>(-1); // -1 = fora do histórico (input livre)
    const draftRef = useRef<string>(""); // guarda o que o usuário estava digitando antes de navegar

    const bodyRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // auto-scroll quando novas linhas chegam
    useEffect(() => {
        if (bodyRef.current) {
            bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
        }
    }, [lines]);

    // captura o teclado automaticamente, sem precisar clicar no input
    useEffect(() => {
        const focusInput = () => {
            inputRef.current?.focus();
        };

        focusInput();

        const handleGlobalKeyDown = () => {
            if (document.activeElement !== inputRef.current) {
                focusInput();
            }
        };

        window.addEventListener("keydown", handleGlobalKeyDown);
        return () => window.removeEventListener("keydown", handleGlobalKeyDown);
    }, []);

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            const command = inputValue.trim();
            if (!command) return;

            handleInput(command);

            // adiciona ao histórico, evitando duplicar se for igual ao último comando
            setHistory(prev => (prev[prev.length - 1] === command ? prev : [...prev, command]));

            historyIndexRef.current = -1;
            draftRef.current = "";
            setInputValue("");
            return;
        }

        if (e.key === "ArrowUp") {
            e.preventDefault(); // evita mover o cursor de texto ou rolar a página

            if (history.length === 0) return;

            // primeira vez subindo: guarda o que estava sendo digitado
            if (historyIndexRef.current === -1) {
                draftRef.current = inputValue;
                historyIndexRef.current = history.length - 1;
            } else if (historyIndexRef.current > 0) {
                historyIndexRef.current -= 1;
            }

            setInputValue(history[historyIndexRef.current]);
            return;
        }

        if (e.key === "ArrowDown") {
            e.preventDefault();

            if (historyIndexRef.current === -1) return;

            if (historyIndexRef.current < history.length - 1) {
                historyIndexRef.current += 1;
                setInputValue(history[historyIndexRef.current]);
            } else {

                historyIndexRef.current = -1;
                setInputValue(draftRef.current);
            }
        }
    };

    return (
        <div className="terminal-card">

            <div className="terminal-card__header">
                <div className="terminal-card__title">
                    <span className="material-symbols-outlined">
                        terminal
                    </span>
                    {title}
                </div>

                <div className="terminal-card__status">
                    <span className="terminal-card__dot"/>
                    LIVE
                </div>
            </div>

            <div className="terminal-card__body" ref={bodyRef}>

                {lines.map((line, index) => (
                    <div
                        key={index}
                        className={`terminal-card__line terminal-card__line--${line.type ?? "info"}`}
                    >
                        {line.text}
                    </div>
                ))}

                <div className="terminal-card__prompt-row">
                    <span className="terminal-card__prompt">Analytics &gt;</span>
                    <span className="terminal-card__typed">{inputValue}</span>
                    <span className="terminal-card__cursor">_</span>

                    <input
                        ref={inputRef}
                        className="terminal-card__hidden-input"
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={onKeyDown}
                        disabled={isLoading}
                        autoFocus
                        autoComplete="off"
                        spellCheck={false}
                    />
                </div>

            </div>
        </div>
    );
}