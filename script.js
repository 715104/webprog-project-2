function convert() {

    var number = document.getElementById("number").value;
    var from = document.getElementById("from").value;
    var to = document.getElementById("to").value;

    var result = number;

    if (from == "meters" && to == "kilometers") {
        result = number / 1000;
    }

    if (from == "kilometers" && to == "meters") {
        result = number * 1000;
    }

    if (from == "meters" && to == "centimeters") {
        result = number * 100;
    }

    if (from == "centimeters" && to == "meters") {
        result = number / 100;
    }

    if (from == "meters" && to == "miles") {
        result = number / 1609.34;
    }

    if (from == "miles" && to == "meters") {
        result = number * 1609.34;
    }

    if (from == "kilometers" && to == "miles") {
        result = number / 1.60934;
    }

    if (from == "miles" && to == "kilometers") {
        result = number * 1.60934;
    }

    if (from == "centimeters" && to == "kilometers") {
        result = number / 100000;
    }

    if (from == "kilometers" && to == "centimeters") {
        result = number * 100000;
    }

    if (from == "centimeters" && to == "miles") {
        result = number / 160934;
    }

    if (from == "miles" && to == "centimeters") {
        result = number * 160934;
    }

    document.getElementById("result").innerHTML = "Result: " + result;
}
