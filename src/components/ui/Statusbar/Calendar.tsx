import { Icon } from "@iconify/react";
import { useState } from "react";

export const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const generateCalendarDates = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const dates = [];

    // previous month's days
    const prevMonth = new Date(currentDate);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    const prevMonthDays = getDaysInMonth(prevMonth);
    for (let i = firstDay - 1; i >= 0; i--) {
      dates.push(
        new Date(
          prevMonth.getFullYear(),
          prevMonth.getMonth(),
          prevMonthDays - i
        )
      );
    }

    // current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      dates.push(
        new Date(currentDate.getFullYear(), currentDate.getMonth(), i)
      );
    }

    // next month's days
    const nextMonth = new Date(currentDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const daysToAdd = 42 - dates.length; // 6 weeks * 7 days
    for (let i = 1; i <= daysToAdd; i++) {
      dates.push(new Date(nextMonth.getFullYear(), nextMonth.getMonth(), i));
    }

    return dates;
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <div className="max-w-sm p-4 bg-transparent rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-2 rounded-full hover:bg-[var(--tertiary)] 
            transition-all duration-200 opacity-50 hover:opacity-100 hover:text-background"
        >
          <Icon icon={"mingcute:left-line"} />
        </button>
        <h2 className="text-lg font-semibold">
          {currentDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <button
          onClick={handleNextMonth}
          className="p-2 rounded-full hover:bg-[var(--tertiary)] 
            transition-all duration-200 opacity-50 hover:opacity-100 hover:text-background"
        >
          <Icon icon={"mingcute:right-line"} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {daysOfWeek.map((day) => (
          <div key={day} className="text-center text-sm font-medium">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {generateCalendarDates().map((date, index) => {
          const isCurrentMonth = date.getMonth() === currentDate.getMonth();
          const isSelected =
            selectedDate?.toDateString() === date.toDateString();

          return (
            <button
              key={index}
              onClick={() => handleDateClick(date)}
              className={`p-2 text-sm rounded hover:bg-[var(--secondary)] transition-colors duration-200
                ${
                  isSelected
                    ? `text-foreground bg-[var(--primary)] dark:hover:text-background hover:bg-[var(--tertiary)]`
                    : ""
                }
                ${isCurrentMonth ? "text-foreground" : "text-gray-400"}
                ${
                  !isSelected && isCurrentMonth
                    ? "hover:bg-[var(--secondary)] hover:text-foreground dark:hover:text-background"
                    : ""
                }`}
              disabled={!isCurrentMonth}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};
