// Prints monthly todos in the format
/* 
# 2023 Nov

## Wed: Nov 01
- [ ]

## Thu: Nov 02
- [ ]

## Fri: Nov 03
- [ ]
*/
// Author: Larry Battle @MIT License
// date created: 2023 Nov 1
const dateToFormat = (d) => {
    const monthName = d.toLocaleString("en-US", { month: 'short' });
    const day = String(d.getDate()).padStart(2, '0');
    const dow = d.toLocaleString("en-US", {weekday : "short"});
    return `${dow}: ${monthName} ${day}`;
};

const printMonthTodo = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();

    const monthName = currentDate.toLocaleString("en-US", { month: 'short' });
    console.log(`# ${year} ${monthName}\n`);

    for (let day = 1; day <= lastDayOfMonth; day++) {
        currentDate.setDate(day);
        console.log(`## ${dateToFormat(currentDate)}`);
        console.log("- [ ] \n");
    }
};

printMonthTodo();
