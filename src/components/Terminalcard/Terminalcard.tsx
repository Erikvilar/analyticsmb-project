import { useState, useRef, useEffect } from "react";

import "./Terminalcard.css";
import useTerminalData from "../../hooks/useTerminalData.ts";

interface TerminalCardProps {
    title?: string;
}

export default function TerminalCard({
                                         title = "Terminal",
                                     }: TerminalCardProps) {

    const { lines, handleInput, isLoading } = useTerminalData();

    const [inputValue, setInputValue] = useState("");

    const [history, setHistory] = useState<string[]>([]);
    const [, forceUpdate] = useState(0);
    const historyIndexRef = useRef(-1);
    const draftRef = useRef("");

    const bodyRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        bodyRef.current?.scrollTo({
            top: bodyRef.current.scrollHeight,
            behavior: "smooth",
        });
    }, [lines]);

    useEffect(() => {

        const focus = () => inputRef.current?.focus();

        focus();

        const listener = () => {
            if (document.activeElement !== inputRef.current) {
                focus();
            }
        };

        window.addEventListener("keydown", listener);

        return () => window.removeEventListener("keydown", listener);

    }, []);

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {

        if (e.key === "Enter") {

            const command = inputValue.trim();

            if (!command) return;

            handleInput(command);

            setHistory(prev =>
                prev.at(-1) === command ? prev : [...prev, command]
            );

            historyIndexRef.current = -1;
            draftRef.current = "";

            setInputValue("");

            return;
        }

        if (e.key === "ArrowUp") {

            e.preventDefault();

            if (!history.length) return;

            if (historyIndexRef.current === -1) {

                draftRef.current = inputValue;

                historyIndexRef.current = history.length - 1;

            } else if (historyIndexRef.current > 0) {

                historyIndexRef.current--;

            }

            setInputValue(history[historyIndexRef.current]);

            requestAnimationFrame(() => {
                inputRef.current?.setSelectionRange(
                    history[historyIndexRef.current].length,
                    history[historyIndexRef.current].length
                );
            });

            return;
        }

        if (e.key === "ArrowDown") {

            e.preventDefault();

            if (historyIndexRef.current === -1) return;

            if (historyIndexRef.current < history.length - 1) {

                historyIndexRef.current++;

                const cmd = history[historyIndexRef.current];

                setInputValue(cmd);

                requestAnimationFrame(() => {
                    inputRef.current?.setSelectionRange(cmd.length, cmd.length);
                });

            } else {

                historyIndexRef.current = -1;

                setInputValue(draftRef.current);

                requestAnimationFrame(() => {
                    inputRef.current?.setSelectionRange(
                        draftRef.current.length,
                        draftRef.current.length
                    );
                });

            }
        }
    };
    const cursor = inputRef.current?.selectionStart ?? inputValue.length;

    const before = inputValue.substring(0, cursor);
    const after = inputValue.substring(cursor);
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
                    <span className="terminal-card__dot" />
                    LIVE
                </div>

            </div>

            <div
                className="terminal-card__body"
                ref={bodyRef}
            >

                {lines.map((line, index) => (
                    <div
                        key={index}
                        className={`terminal-card__line terminal-card__line--${line.type ?? "info"}`}
                    >
                        {line.text}
                    </div>
                ))}

                <div className="terminal-card__prompt-row">

    <span className="terminal-card__prompt">
        Analytics &gt;
    </span>

                    <span className="terminal-card__typed">
        {before}
    </span>

                    <span className="terminal-card__cursor">
        _
    </span>

                    <span className="terminal-card__typed">
        {after}
    </span>

                    <input
                        ref={inputRef}
                        className="terminal-card__hidden-input"
                        type="text"
                        value={inputValue}
                        onChange={(e) => {
                            setInputValue(e.target.value);
                        }}
                        onKeyDown={onKeyDown}
                        onKeyUp={() => forceUpdate(x => x + 1)}
                        onClick={() => forceUpdate(x => x + 1)}
                        onSelect={() => forceUpdate(x => x + 1)}
                        disabled={isLoading}
                        autoComplete="off"
                        spellCheck={false}
                    />

                </div>
            </div>

        </div>
    );
}