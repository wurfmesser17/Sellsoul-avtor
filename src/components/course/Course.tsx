import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  BookOpen,
  ArrowRight,
  TrendingUp,
  Package,
  XCircle,
  MapPin,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface Lesson {
  id: number;
  tag: string;
  title: string;
  sub: string;
  content: React.ReactNode;
}

const LESSONS: Lesson[] = [
  {
    id: 0,
    tag: "Урок 00 / Вступление",
    title: "Моя главная ошибка",
    sub: "Прочитай это прежде чем тратить деньги",
    content: (
      <div className="space-y-6">
        <p>До того как мой магазин одобрили на Kaspi — я уже потратил деньги. Не на товар. На личное. Из бизнес-капитала.</p>
        <p>Начинал с ~500 000 ₸. К моменту первых заказов осталось около 200 000 ₸. Я хочу чтобы вы избежали этого.</p>
        
        <div className="border-l-4 border-brand-ink bg-zinc-50 p-4 rounded-r-xl">
          <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-1">
            Правило №1
          </h4>
          <p className="text-sm">Не трогай бизнес-деньги до первой прибыли. Вообще. Даже «на пару дней». Это не теория. Это мой первый урок — оплаченный из собственного кармана.</p>
        </div>

        <div className="border-l-4 border-red-500 bg-red-50/50 p-4 rounded-r-xl text-red-900">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Внимание</span>
          </div>
          <p className="text-xs">Прежде чем открывать ИП или Kaspi магазин — ознакомьтесь с курсом полностью. Все действия вы выполняете на свой страх и риск.</p>
        </div>
      </div>
    )
  },
  {
    id: 1,
    tag: "Урок 01",
    title: "Регистрация ИП",
    sub: "Всё через приложение, без визитов в госорганы",
    content: (
      <div className="space-y-6">
        <div className="space-y-4">
          {[
            "Открой приложение Kaspi.kz",
            "Перейди в раздел Госуслуги → Регистрация ИП",
            "Следуй инструкциям на экране",
            "Статус отслеживай в Госуслуги → Мои заявки"
          ].map((step, i) => (
            <div key={i} className="flex gap-4 p-4 border border-brand-line rounded-xl items-start">
              <span className="h-6 w-6 rounded-full bg-brand-ink text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">{i+1}</span>
              <p className="text-sm font-medium">{step}</p>
            </div>
          ))}
        </div>
        <div className="bg-zinc-50 p-6 rounded-2xl border border-brand-line">
           <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted block mb-2">Налоговый режим</span>
           <p className="text-sm">Упрощёнка — 3% с дохода (УСН). В течение часа придёт документ «Уведомление о начале деятельности».</p>
        </div>
      </div>
    )
  },
  {
    id: 2,
    tag: "Урок 02",
    title: "Подключение Kaspi Pay",
    sub: "Настройка за 10 минут",
    content: (
      <div className="space-y-6">
        <div className="space-y-4">
          {[
            "Скачай Kaspi Pay и зарегистрируйся по ИИН",
            "Пройди фото-верификацию и подпиши документы",
            "Настрой торговую точку"
          ].map((step, i) => (
            <div key={i} className="flex gap-4 p-4 border border-brand-line rounded-xl items-start">
              <span className="h-6 w-6 rounded-full bg-brand-ink text-zinc-300 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">{i+1}</span>
              <p className="text-sm font-medium">{step}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-brand-muted italic">Результат: Ты готов принимать оплату через Kaspi QR — с Kaspi Gold, Kaspi Red+, Kredit и картами других банков.</p>
      </div>
    )
  },
  {
    id: 3,
    tag: "Урок 03",
    title: "Период активации — 20 дней",
    sub: "Как пройти активацию и не слететь",
    content: (
      <div className="space-y-6">
        <p>Kaspi не открывает магазин всем подряд. Нужно показать что у тебя идёт бизнес — обороты, регулярные оплаты.</p>
        <div className="border-l-4 border-brand-ink bg-zinc-50 p-4 rounded-r-xl">
          <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-1">Золотой минимум</h4>
          <p className="text-sm">5 оплат в день. Состав: 3 знакомых + 2 незнакомых. Один человек не должен повторяться в течение 7 дней.</p>
        </div>
        <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
          <p className="text-xs text-amber-900 leading-relaxed italic">Схема с деньгами: Посчитай общую сумму за 20 дней заранее. Передай её посреднику — он будет скидывать деньги плательщикам, ты принимаешь и возвращаешь через посредника.</p>
        </div>
      </div>
    )
  },
  {
    id: 4,
    tag: "Урок 04",
    title: "Анализ товара",
    sub: "Что продавать — и как это понять до закупа",
    content: (
      <div className="space-y-6">
        <ul className="steps space-y-3">
          {[
            "Выбираем нишу в Kaspi Магазине",
            "Настраиваем фильтры: Рекомендации, Высокий рейтинг",
            "Проверяем товары через SellStat (Telegram-бот)",
            "Ищем на 1688 по скриншоту товара",
            "Уточняем у поставщика вес и упаковку"
          ].map((step, i) => (
            <li key={i} className="flex gap-4 p-4 border border-brand-line rounded-xl items-start">
              <span className="h-6 w-6 rounded-full bg-brand-ink text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">{i+1}</span>
              <p className="text-sm font-medium">{step}</p>
            </li>
          ))}
        </ul>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-zinc-50 rounded-2xl border border-brand-line">
            <h4 className="text-[10px] font-bold uppercase tracking-widest mb-2">SellStat Ориентиры</h4>
            <ul className="text-[10px] space-y-1 text-brand-muted font-mono">
              <li>• Продавцов: до 7</li>
              <li>• Продаж: 3–6 в день</li>
              <li>• Отзывов: 100–200</li>
            </ul>
          </div>
          <div className="p-4 bg-zinc-50 rounded-2xl border border-brand-line">
            <h4 className="text-[10px] font-bold uppercase tracking-widest mb-2">Карго</h4>
            <p className="text-[10px] text-brand-muted leading-tight">Жана Пост. Тариф ~$3.9 за кг. Старт: 10–30 штук.</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 5,
    tag: "Урок 05",
    title: "Юнит-экономика",
    sub: "Считай до закупа, не после",
    content: (
      <div className="space-y-6">
        <div className="bg-brand-ink text-zinc-50 p-6 rounded-2xl font-mono text-xs space-y-1">
          <p>Маржа = Цена продажи</p>
          <p>− Комиссия Kaspi (10.9%)</p>
          <p>− Налог ИП (3%)</p>
          <p>− Себестоимость (Товар + Карго)</p>
          <div className="h-px bg-white/20 my-2" />
          <p className="font-bold text-emerald-400">= ЧИСТАЯ ПРИБЫЛЬ ₸</p>
        </div>
        <div className="border-2 border-brand-ink p-6 rounded-2xl text-center">
           <h4 className="text-[10px] font-bold uppercase tracking-widest mb-2 text-brand-muted">Золотое правило маржи</h4>
           <p className="text-2xl font-black italic tracking-tighter">ОТ 3 000 ₸ С ЕДИНИЦЫ</p>
        </div>
      </div>
    )
  },
  {
    id: 6,
    tag: "Урок 06",
    title: "Реклама на Kaspi",
    sub: "Оплата только за клики",
    content: (
      <div className="space-y-6">
        <div className="bg-zinc-50 p-6 rounded-2xl border border-brand-line space-y-4">
           <div className="space-y-2">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">Условия запуска</h4>
              <p className="text-xs">• Оплата только за клики</p>
              <p className="text-xs">• Мин. ставка — 3 ₸</p>
              <p className="text-xs">• Бонус: 20 000 бонусов новичкам</p>
           </div>
        </div>
        <p className="text-sm font-medium">Ключ к успеху: Высокая ставка за клик + Высокая конверсия в заказы.</p>
      </div>
    )
  },
  {
    id: 7,
    tag: "Урок 07",
    title: "Стратегии продаж",
    sub: "Привязка или свой бренд",
    content: (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 border border-brand-line rounded-3xl space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest">Привязка</h4>
            <p className="text-xs text-brand-muted">Быстрый старт в чужих карточках. Конкуренция ТОЛЬКО по цене.</p>
          </div>
          <div className="p-6 border border-brand-line rounded-3xl space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest">Свой бренд</h4>
            <p className="text-xs text-brand-muted">Создание своих карточек. Игра вдолгую, защита от демпинга.</p>
          </div>
        </div>
        <div className="bg-zinc-50 p-4 rounded-xl text-center text-[10px] font-mono font-bold uppercase tracking-widest">
          Ищи товары в малоизвестных категориях — меньше конкуренции.
        </div>
      </div>
    )
  },
  {
    id: 8,
    tag: "Урок 08",
    title: "Оборудование",
    sub: "Подготовка склада",
    content: (
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="p-6 bg-zinc-50 rounded-3xl border border-brand-line flex items-center gap-6">
            <div className="text-3xl">🖨️</div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest">Термопринтер</h4>
              <p className="text-xs text-brand-muted">XPrinter 365B. Этикетки 75×120 мм.</p>
            </div>
          </div>
          <div className="p-6 bg-zinc-50 rounded-3xl border border-brand-line flex items-center gap-6">
            <div className="text-3xl">📦</div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest">Упаковка</h4>
              <p className="text-xs text-brand-muted">Курьерские пакеты, стрейч-плёнка (обязательно для Kaspi).</p>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 9,
    tag: "Урок 09",
    title: "Zero Cancellation",
    sub: "Никогда не отменяйте заказы",
    content: (
      <div className="space-y-6">
        <div className="bg-red-50 p-8 rounded-[2rem] border-2 border-red-200 text-red-900 space-y-4">
           <XCircle size={32} className="opacity-50" />
           <p className="text-lg font-black leading-tight uppercase tracking-tighter">Отмена убивает магазин</p>
           <p className="text-sm font-medium">Всего 2 отмены могут обнулить рейтинг и закрыть доступ к доставке.</p>
        </div>
      </div>
    )
  },
  {
    id: 10,
    tag: "Урок 10",
    title: "Настройка склада",
    sub: "Локации приема заказов",
    content: (
      <div className="space-y-6">
        <ul className="steps space-y-4">
          {[
            "Kaspi Pay → Настройки → Склад",
            "Введи текущий адрес склада (РР1)",
            "Включи Kaspi Доставку",
            "Выбери ближайшие пункты на карте"
          ].map((step, i) => (
            <li key={i} className="flex gap-4 p-4 border border-brand-line rounded-xl items-start">
              <span className="h-6 w-6 rounded-full bg-brand-ink text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">{i+1}</span>
              <p className="text-sm font-medium">{step}</p>
            </li>
          ))}
        </ul>
      </div>
    )
  },
  {
    id: 11,
    tag: "Урок 11",
    title: "Чего не стоит делать",
    sub: "Финал обучения",
    content: (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-3">
          {[
            "Не закупай большими партиями",
            "Не начинай в кредит",
            "Не продавай то, что нравится только тебе",
            "Не принимай решения на эмоциях",
            "Не останавливайся в обучении"
          ].map((text, i) => (
            <div key={i} className="p-5 border-2 border-brand-line rounded-3xl flex items-center gap-4">
              <CheckCircle2 size={20} className="text-emerald-500" />
              <span className="text-xs font-black uppercase tracking-widest leading-tight">{text}</span>
            </div>
          ))}
        </div>
        <div className="pt-12 text-center space-y-2">
            <h4 className="text-2xl font-black tracking-tighter uppercase">УДАЧНЫХ ПРОДАЖ</h4>
            <p className="text-[9px] font-mono text-zinc-300 uppercase tracking-[0.4em]">@SELLSOUL_KZ // 2026</p>
        </div>
      </div>
    )
  }
];

export function Course() {
  const [activeLesson, setActiveLesson] = useState(0);
  const progress = ((activeLesson + 1) / LESSONS.length) * 100;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeLesson]);

  const currentLesson = LESSONS[activeLesson];

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-[calc(100vh-120px)] animate-in fade-in duration-700">
      <div className="w-full lg:w-72 lg:flex-shrink-0 space-y-6">
        <div className="bg-white border-2 border-brand-ink rounded-[2rem] p-6 lg:sticky lg:top-8 overflow-hidden relative">
          <div className="absolute top-0 left-0 h-1 bg-brand-ink transition-all duration-300" style={{ width: `${progress}%` }} />
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
            <BookOpen size={14} /> Учебный план
          </h3>
          <div className="space-y-1">
            {LESSONS.map((l, i) => (
              <button
                key={l.id}
                onClick={() => setActiveLesson(i)}
                className={cn(
                  "flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-all",
                  activeLesson === i 
                    ? "bg-brand-ink text-zinc-50" 
                    : "text-brand-muted hover:bg-zinc-50"
                )}
              >
                <span className={cn(
                  "text-[9px] font-mono mt-1 w-5",
                  activeLesson === i ? "text-white/50" : "text-zinc-200"
                )}>
                  {String(i).padStart(2, '0')}
                </span>
                <span className="text-xs font-bold leading-tight">{l.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-2xl mx-auto space-y-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeLesson}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-1"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-300">
              {currentLesson.tag}
            </span>
            <h2 className="text-5xl font-extrabold tracking-tighter uppercase leading-none">
              {currentLesson.title}
            </h2>
            <p className="text-sm text-brand-muted font-mono uppercase tracking-widest pt-2 flex items-center gap-2">
              <span className="h-0.5 w-4 bg-brand-ink" />
              {currentLesson.sub}
            </p>
            
            <div className="pt-12 text-brand-ink">
              {currentLesson.content}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-4 pt-12 border-t border-brand-line pb-12">
          <button
            disabled={activeLesson === 0}
            onClick={() => setActiveLesson(prev => prev - 1)}
            className="flex-1 rounded-2xl border-2 border-brand-line px-6 py-4 text-[10px] font-bold uppercase tracking-widest transition-all hover:border-brand-ink disabled:opacity-30"
          >
            Назад
          </button>
          <button
            onClick={() => activeLesson < LESSONS.length - 1 ? setActiveLesson(prev => prev + 1) : setActiveLesson(0)}
            className="flex-3 rounded-2xl bg-brand-ink text-zinc-50 px-6 py-4 text-[10px] font-bold uppercase tracking-widest transition-all hover:bg-zinc-800"
          >
            {activeLesson === LESSONS.length - 1 ? "В начало" : "Далее"}
          </button>
        </div>
      </div>
    </div>
  );
}
