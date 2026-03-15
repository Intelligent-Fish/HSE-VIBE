import { useState } from "react";
import { Settings, Monitor, CloudOffIcon, ChevronUpIcon, ChevronDownIcon } from "lucide-react";
import Hero1 from "../../assets/hero1.png";
import Hero2 from "../../assets/hero2.png";
import Hero3 from "../../assets/hero3.png";
import Hero4 from "../../assets/hero4.png";
import Hero5 from "../../assets/hero5.png";
import Divider1 from "../../assets/divider1.png";
import Divider2 from "../../assets/divider2.png";

const downloadUrl = "https://github.com/Intelligent-Fish/HSE-VIBE/tree/main";

const problemCards = [
    {
        icon: Settings,
        text: "Автоматический подбор стратегий обхода (Fake, Split, Desync) в реальном времени.",
    },
    { icon: Monitor, text: "Легковесный интерфейс, не перегружающий системные ресурсы." },
    {
        icon: CloudOffIcon,
        text: "Весь трафик обрабатывается локально. Никакие данные не отправляются на сторонние серверы.",
    },
];

const architecture = [
    {
        title: "Backend",
        description:
            "Мощное ядро на C# автоматически подбирает стратегии обхода и обрабатывает весь трафик локально, гарантируя полную приватность. Система сама обновляет сигнатуры zapret и поддерживает стабильное соединение без вмешательства пользователя.",
    },
    {
        title: "Frontend",
        description:
            "Интерфейс на React мгновенно отображает статус подключения и дает пользователю простой контроль над системой. Легковесный дизайн не перегружает устройство, оставляя только самые важные элементы управления.",
    },
    {
        title: "Design",
        description:
            "Для создания графических интерфейсов использовалась Figma. Цвета подобраны на основе кода Добрый со вкусом апельсина, где зеленый цвет также символизирует доступ, открытость.",
    },
];

const team = [
    { name: "Леонид Антропов", tags: ["PM", "Капитан"], handle: "@antropovl", photo: Hero4 },
    { name: "Артемий Дорохин", tags: ["Designer"], handle: "@selfpacification", photo: Hero5 },
    { name: "Артём Кротов", tags: ["FullStack"], handle: "@PiPiDaStRiC1", photo: Hero1 },
    { name: "Мария Ананьева", tags: ["Frontend"], handle: "@An_Masha", photo: Hero2 },
    { name: "Михаил Шеставин", tags: ["Backend"], handle: "@L6yPeBcTHuK_J", photo: Hero3 },
];

function App() {
    const [accItems, setAccItems] = useState<string[]>([]);

    return (
        <div id="top" className="min-h-screen bg-[#d9d9d9] text-zinc-900">
            <header className="sticky top-0 z-30 border-b border-zinc-300/90 bg-[#d9d9d9]/95 backdrop-blur">
                <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
                    <a className="text-sm font-medium tracking-tight sm:text-lg" href="#top">
                        Dobriy zapret
                    </a>
                    <nav
                        className="flex items-center gap-4 text-sm sm:gap-7 sm:text-base"
                        aria-label="Навигация"
                    >
                        <a
                            className="border-b-2 border-transparent transition hover:border-[#ff7f3e]"
                            href="#top"
                        >
                            Скачать
                        </a>
                        <a
                            className="border-b-2 border-transparent transition hover:border-[#ff7f3e]"
                            href="#problem"
                        >
                            Проблема
                        </a>
                        <a
                            className="border-b-2 border-transparent transition hover:border-[#ff7f3e]"
                            href="#architecture"
                        >
                            Архитектура
                        </a>
                        <a
                            className="border-b-2 border-transparent transition hover:border-[#ff7f3e]"
                            href="#team"
                        >
                            Команда
                        </a>
                    </nav>
                </div>
            </header>
            <main>
                <section className="mx-auto flex min-h-[72vh] w-full max-w-[1200px] flex-col items-center justify-center px-4 pb-14 pt-20 text-center sm:px-6 lg:px-10">
                    <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
                        Dobriy zapret
                    </h1>
                    <p className="mt-5 max-w-[730px] text-lg leading-tight text-zinc-900 sm:text-xl md:text-4xl">
                        Современный графический интерфейс для инструмента обхода блокировок Zapret.
                        Минимум настроек. Максимальная эффективность. Полная автоматизация.
                    </p>
                    <a
                        className="mt-8 inline-flex min-h-12 min-w-32 items-center justify-center rounded-xl bg-[#88dd34] px-8 text-lg font-medium transition hover:-translate-y-0.5"
                        href={downloadUrl}
                        target="_blank"
                        rel="noreferrer"
                    >
                        Скачать
                    </a>
                </section>

                <section
                    className="mx-auto grid w-full max-w-[1200px] gap-8 px-4 pb-8 sm:px-6 md:grid-cols-[0.9fr_1.2fr] lg:gap-12 lg:px-10"
                    id="problem"
                >
                    <div>
                        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                            Проблема
                        </h2>
                        <p className="mt-4 max-w-[500px] text-sm leading-snug text-zinc-800 sm:text-base md:text-2xl">
                            Доступ к информации все чаще требует технических знаний и постоянной
                            настройки. Пользователи жертвуют приватностью и ресурсами устройства, а
                            устаревшие методы делают простой серфинг утомительным.
                        </p>
                    </div>

                    <div className="grid gap-4 md:gap-5">
                        {problemCards.map((item) => (
                            <article
                                className="grid grid-cols-[2.5rem_1fr] items-start gap-3 rounded-2xl bg-[#e2e2e2] p-4 sm:grid-cols-[3rem_1fr] sm:p-5"
                                key={item.text}
                            >
                                <span
                                    className="grid h-10 w-10 place-items-center rounded-md bg-[#88dd34] text-xl font-bold sm:h-12 sm:w-12 sm:text-2xl"
                                    aria-hidden="true"
                                >
                                    <item.icon />
                                </span>
                                <p className="text-base leading-snug text-zinc-900 sm:text-lg md:text-[1.95rem]">
                                    {item.text}
                                </p>
                            </article>
                        ))}
                    </div>
                </section>

                <img src={Divider1} alt="Divider" className="wave-divider" />

                <section
                    className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-10"
                    id="architecture"
                >
                    <h2 className="text-center text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                        Архитектура
                    </h2>
                    <div className="mx-auto mt-7 grid max-w-[900px] gap-4">
                        {architecture.map((item) => (
                            <details
                                className="group rounded-2xl border-2 border-[#ff6d2d] bg-[#efefef]"
                                key={item.title}
                                onClick={() =>
                                    setAccItems((prev) =>
                                        prev.includes(item.title)
                                            ? prev.filter((v) => v !== item.title)
                                            : [...prev, item.title],
                                    )
                                }
                            >
                                <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 text-xl font-bold sm:text-[2rem]">
                                    <span>{item.title}</span>
                                    <span className="text-2xl transition group-open:rotate-0">
                                        {accItems.includes(item.title) ? (
                                            <ChevronUpIcon />
                                        ) : (
                                            <ChevronDownIcon />
                                        )}
                                    </span>
                                </summary>
                                <p className="px-5 pb-5 text-sm leading-snug text-zinc-800 sm:text-base md:text-lg">
                                    {item.description}
                                </p>
                            </details>
                        ))}
                    </div>
                </section>

                <img src={Divider2} alt="Divider" className="wave-divider" />

                <section className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-10" id="team">
                    <h2 className="text-center text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                        Команда проекта
                    </h2>
                    <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-5 md:gap-4">
                        {team.map((member) => (
                            <article className="text-center" key={member.name}>
                                <div className="flex justify-center">
                                    {member.photo ? (
                                        <img
                                            src={member.photo}
                                            alt={member.name}
                                            className="h-24 w-24 rounded-full bg-zinc-300 object-cover sm:h-28 sm:w-28 md:h-32 md:w-32"
                                        />
                                    ) : (
                                        <div
                                            className="grid h-24 w-24 place-items-center rounded-full bg-radial from-zinc-100 to-zinc-400 text-2xl font-semibold text-zinc-600 sm:h-28 sm:w-28 md:h-32 md:w-32 md:text-3xl"
                                            aria-hidden="true"
                                        >
                                            {member.name
                                                .split(" ")
                                                .map((part) => part[0])
                                                .join("")
                                                .slice(0, 2)}
                                        </div>
                                    )}
                                </div>
                                <h3 className="mx-auto mt-3 max-w-36 text-xl font-semibold leading-none sm:text-2xl">
                                    {member.name}
                                </h3>
                                <div className="mt-2 flex flex-wrap justify-center gap-1.5">
                                    {member.tags.map((tag) => (
                                        <span
                                            className="rounded bg-[#ffc08e] px-2 py-0.5 text-[10px] uppercase tracking-wide"
                                            key={tag}
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <p className="mt-2 text-xs text-zinc-600 sm:text-sm">
                                    {member.handle}
                                </p>
                            </article>
                        ))}
                    </div>
                </section>
            </main>

            <section className="mx-auto mt-20 grid w-full gap-5 bg-[#cccccc] px-4 py-10 sm:px-6 md:mt-28 md:grid-cols-[1fr_auto] md:items-center lg:px-10">
                <div>
                    <h3 className="text-2xl font-medium sm:text-3xl">Будьте в курсе</h3>
                    <p className="mt-2 text-sm text-zinc-700 sm:text-base">
                        Получайте обновления о новых возможностях
                    </p>
                </div>
                <form
                    className="grid gap-2 sm:grid-cols-[minmax(220px,360px)_auto] sm:items-center"
                    onSubmit={(event) => event.preventDefault()}
                >
                    <label className="sr-only" htmlFor="email">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        className="h-11 rounded bg-zinc-300 px-3 text-sm outline-none ring-[#88dd34] placeholder:text-zinc-500 focus:ring-2"
                        placeholder="Ваша почта"
                    />
                    <button
                        type="submit"
                        className="h-11 rounded bg-[#88dd34] px-5 text-sm font-medium transition hover:brightness-95"
                    >
                        Подписать
                    </button>
                </form>
            </section>

            <footer className="bg-[#4c4c4c] text-zinc-100">
                <div className="mx-auto grid w-full max-w-[1200px] grid-cols-2 gap-7 px-4 py-10 sm:px-6 md:grid-cols-3 lg:grid-cols-6 lg:px-10">
                    <div>
                        <h4 className="mb-3 text-base font-semibold">Продукт</h4>
                        <a
                            className="mb-2 block text-sm opacity-90 hover:opacity-100"
                            href={downloadUrl}
                        >
                            Скачать
                        </a>
                        <a
                            className="mb-2 block text-sm opacity-90 hover:opacity-100"
                            href="#architecture"
                        >
                            Архитектура
                        </a>
                        <a className="mb-2 block text-sm opacity-90 hover:opacity-100" href="#">
                            Лицензия
                        </a>
                        <a className="block text-sm opacity-90 hover:opacity-100" href="#">
                            Исходный код
                        </a>
                    </div>
                    <div>
                        <h4 className="mb-3 text-base font-semibold">Контакты</h4>
                        <a className="mb-2 block text-sm opacity-90 hover:opacity-100" href="#">
                            Email
                        </a>
                        <a className="mb-2 block text-sm opacity-90 hover:opacity-100" href="#">
                            Чат поддержки
                        </a>
                        <a className="mb-2 block text-sm opacity-90 hover:opacity-100" href="#">
                            Форма обратной связи
                        </a>
                        <a className="block text-sm opacity-90 hover:opacity-100" href="#">
                            Сообщить об ошибке
                        </a>
                    </div>
                    <div>
                        <h4 className="mb-3 text-base font-semibold">Ресурсы</h4>
                        <a className="mb-2 block text-sm opacity-90 hover:opacity-100" href="#">
                            Гайды
                        </a>
                        <a className="mb-2 block text-sm opacity-90 hover:opacity-100" href="#">
                            Вопросы
                        </a>
                        <a className="mb-2 block text-sm opacity-90 hover:opacity-100" href="#">
                            Статьи
                        </a>
                        <a className="block text-sm opacity-90 hover:opacity-100" href="#">
                            Поддержка
                        </a>
                    </div>
                    <div>
                        <h4 className="mb-3 text-base font-semibold">Правовое</h4>
                        <a className="mb-2 block text-sm opacity-90 hover:opacity-100" href="#">
                            Конфиденциальность
                        </a>
                        <a className="mb-2 block text-sm opacity-90 hover:opacity-100" href="#">
                            Cookies
                        </a>
                        <a className="block text-sm opacity-90 hover:opacity-100" href="#">
                            Соглашение
                        </a>
                    </div>
                    <div>
                        <h4 className="mb-3 text-base font-semibold">Социальное</h4>
                        <a className="mb-2 block text-sm opacity-90 hover:opacity-100" href="#">
                            Мы в Telegram
                        </a>
                        <a className="mb-2 block text-sm opacity-90 hover:opacity-100" href="#">
                            Мы в GitHub
                        </a>
                        <a className="block text-sm opacity-90 hover:opacity-100" href="#">
                            Мы в Discord
                        </a>
                    </div>
                    <div>
                        <h4 className="mb-3 text-base font-semibold">Компания</h4>
                        <a className="mb-2 block text-sm opacity-90 hover:opacity-100" href="#team">
                            Команда
                        </a>
                        <a className="block text-sm opacity-90 hover:opacity-100" href="#">
                            Контакты
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default App;
