function StockProcessor(rowData) {
    result = []
    // Skip the rows if the row has less than 3 elements that is numbers
    while (rowData.length > 0) {
        const row = rowData[0]
        var countOfNumbers = 0;
        for (let i = 0; i < row.length; i++) {
            if (isNumber(row[i])) {
                countOfNumbers++;
            }
        }

        if (countOfNumbers > 2) {
            break;
        }
        result.push(row);
        rowData.shift();
    }

    var monthColumn = -1;
    var yearlyRow = null;
    var tillQ3Row = null;
    var tillQ2Row = null;
    while (rowData.length > 0) {
        const row = rowData[0];

        for (let i = 0; i < row.length; i++) {
            if (monthColumn < 0) {
                const month = getMonth(row[i]);
                if (month) {
                    monthColumn = i;
                    break;
                }
            }
        }
        if (monthColumn < 0) {
            result.push(row);
        } else {
            const month = getMonth(row[monthColumn]);
            const reportPeriod = getReportPeriod(month);
            const newRow = row.slice();
            newRow.push(reportPeriod);

            // The order of date is descending.
            if (reportPeriod === "Yearly") {
                yearlyRow = row;
            } else if (reportPeriod === "TillQ3" && yearlyRow) {
                var anotherRow = rowDelete(yearlyRow, row);
                anotherRow.push("Q4");
                result.push(anotherRow);
                tillQ3Row = row;
                yearlyRow = null;
            } else if (reportPeriod === "TillQ2" && tillQ3Row) {
                var anotherRow = rowDelete(tillQ3Row, row);
                anotherRow.push("Q3");
                result.push(anotherRow);
                tillQ2Row = row;
                tillQ3Row = null;
            } else if (reportPeriod === "Q1" && tillQ2Row) {
                var anotherRow = rowDelete(tillQ2Row, row);
                anotherRow.push("Q2");
                result.push(anotherRow);
                tillQ2Row = null;
            }

            result.push(newRow);
        }

        rowData.shift();
    }
    return result;
}

function getMonth(value) {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD format
    const datePattern02 = /^\d{4}\d{2}-\d{2}$/; // YYYYMM-DD format
    if (datePattern.test(value)) {
        return parseInt(value.substring(5, 7));
    } else if (datePattern02.test(value)) {
        return parseInt(value.substring(4, 6));
    }
    return null;
}

function getReportPeriod(month) {
    if (month >= 1 && month <= 3) {
        return "Q1";
    } else if (month >= 4 && month <= 6) {
        return "TillQ2";
    } else if (month >= 7 && month <= 9) {
        return "TillQ3";
    } else if (month >= 10 && month <= 12) {
        return "Yearly";
    }
    throw new Error("Invalid month: " + month);
}

function rowDelete(row1, row2) {
    var newRow = [];
    for (let i = 0; i < row1.length; i++) {
        newRow.push(valueDelete(row1[i], row2[i]));
    }
    return newRow;
}

function valueDelete(value1, value2) {
    if (isNumber(value1) && isNumber(value2)) {
        return value1 - value2;
    }
    const moneyPattern = /^(\d+(\.\d{1,2})?)(亿|千万|百万|十万|万)$/; // Matches numbers with up to two decimal places
    let match1 = value1.match(moneyPattern)
    let match2 = value2.match(moneyPattern)
    if (match1 && match2) {
        const num1 = parseFloat(match1[0]);
        const num2 = parseFloat(match2[0]);
        // potentially, it could be 亿 - 千万, maybe bug.
        const unit1 = match1[3];
        return (num1 - num2) + unit1;
    }
    return value1;
}

function isNumber(value) {
    return !isNaN(value) && !isNaN(parseFloat(value));
}