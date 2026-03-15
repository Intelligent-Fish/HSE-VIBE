import { useEffect, useState } from "react";

type Theme = "dark" | "light";

const downloadUrl = "https://github.com/Flowseal/zapret-discord-youtube/releases";

const killerFeatures = [
    {
        title: "One-click .exe старт",
        description: "Минимум действий: скачивание, запуск, проверка доступа к нужным сервисам.",
    },
    {
        title: "Стабильность под нагрузкой",
        description:
            "Оптимизированный профиль запуска помогает удерживать стабильный доступ к YouTube и Discord.",
    },
    {
        title: "Понятный визуальный контроль",
        description:
            "Структурированный интерфейс подсказывает, что делать дальше, даже если вы не технарь.",
    },
];

const team = [
    {
        role: "Core Engineer",
        description: "Поддерживает работу .exe-сборки, стабильность и совместимость обновлений.",
    },
    {
        role: "Network Specialist",
        description:
            "Тестирует поведение решений в разных сетевых условиях и сценариях блокировок.",
    },
    {
        role: "Frontend & UX",
        description:
            "Проектирует визуальный слой, навигацию и понятную документацию для быстрого входа.",
    },
];

function App() {
    const [theme, setTheme] = useState<Theme>("dark");

    useEffect(() => {
        const savedTheme = localStorage.getItem("zapret-theme");

        setTheme(savedTheme === "dark" || savedTheme === "light" ? (savedTheme as Theme) : "dark");

        const preferredDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        setTheme(preferredDark ? "dark" : "light");
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("zapret-theme", theme);
    }, [theme]);

    const isDark = theme === "dark";

    return (
        <div className="landing">
            <div className="bg-grid" aria-hidden="true" />
            <header className="topbar">
                <a className="brand" href="#top">
                    <span className="brand-dot" aria-hidden="true" />
                    <span>Dobri Zapret</span>
                </a>
                <nav className="nav-links" aria-label="Навигация по лендингу">
                    <a href="#top">Скачать</a>
                    <a href="#problems">Проблема</a>
                    <a href="#about">О нас</a>
                    <a href="#docs">Документация</a>
                </nav>
                <div className="header-actions">
                    <button
                        className="theme-toggle"
                        type="button"
                        onClick={() => setTheme(isDark ? "light" : "dark")}
                        aria-label="Переключить тему"
                    >
                        {isDark ? "Светлая" : "Темная"}
                    </button>
                </div>
            </header>

            <main>
                <section className="hero section" id="top">
                    <p className="badge">YouTube + Discord Access Helper</p>
                    <h1>Визуальная оболочка для Zapret: быстрый доступ без лишней настройки</h1>
                    <p className="lead">
                        Лаконичный интерфейс для запуска решения обхода ограничений YouTube и
                        Discord. Подходит тем, кто хочет рабочий результат через .exe, без сложной
                        ручной конфигурации.
                    </p>
                    <div className="hero-actions">
                        <a
                            className="btn btn-primary"
                            href={downloadUrl}
                            target="_blank"
                            rel="noreferrer"
                        >
                            Скачать .exe
                        </a>
                        <a className="btn btn-ghost" href="#problems">
                            Какие проблемы решает
                        </a>
                    </div>
                    <p className="disclaimer">
                        Используйте в рамках законодательства вашей юрисдикции и внутренних правил
                        провайдеров сервисов.
                    </p>
                </section>

                <section className="section" id="problems">
                    <h2>Проблема и решение</h2>
                    <p className="lead compact">
                        В условиях ограничений доступ к YouTube и Discord часто становится
                        нестабильным: видео тормозят, голосовые чаты обрываются, а подключение
                        работает непредсказуемо.
                    </p>
                    <p className="lead compact">
                        Zapret в формате .exe предлагает практичный путь: запуск без глубокой ручной
                        настройки и восстановление рабочего доступа за короткое время.
                    </p>
                    <h3 className="subheading">Киллер-фичи</h3>
                    <div className="cards">
                        {killerFeatures.map((feature) => (
                            <article className="card" key={feature.title}>
                                <h3>{feature.title}</h3>
                                <p>{feature.description}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="section split" id="about">
                    <div>
                        <h2>О нас</h2>
                        <p className="lead compact">
                            Мы небольшая прикладная команда, которая делает акцент на доступности,
                            стабильности и понятном запуске.
                        </p>
                        <ul className="list">
                            {team.map((member) => (
                                <li key={member.role}>
                                    <strong>{member.role}:</strong> {member.description}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="glass">
                        <p className="glass-title">О проекте</p>
                        <ol className="steps">
                            <li>
                                Развиваем визуальную оболочку вокруг проверенных решений Zapret.
                            </li>
                            <li>
                                Собираем обратную связь пользователей для улучшений каждого релиза.
                            </li>
                            <li>Документируем типовые сценарии, чтобы запуск был предсказуемым.</li>
                        </ol>
                    </div>
                </section>

                <section className="section" id="docs">
                    <h2>Документация</h2>
                    <div className="accordion">
                        <details className="accordion-item" open>
                            <summary>Backend</summary>
                            <p>
                                Описывает запуск сетевых сценариев, требования окружения и
                                рекомендации для стабильного соединения.
                            </p>
                        </details>
                        <details className="accordion-item">
                            <summary>Frontend</summary>
                            <p>
                                Содержит структуру интерфейса, принципы навигации, доступности и
                                взаимодействия с кнопкой запуска/скачивания.
                            </p>
                        </details>
                        <details className="accordion-item">
                            <summary>Design</summary>
                            <p>
                                Правила визуального стиля: палитра, темы, типографика, анимации и
                                единая система компонентов.
                            </p>
                        </details>
                    </div>
                </section>

                <section className="section cta">
                    <h2>Готово к использованию</h2>
                    <p>
                        Скачайте последний релиз и проверьте работу YouTube и Discord в вашем
                        окружении.
                    </p>
                    <a
                        className="btn btn-primary"
                        href={downloadUrl}
                        target="_blank"
                        rel="noreferrer"
                    >
                        Открыть страницу релизов
                    </a>
                </section>
            </main>
        </div>
    );
}

export default App;
