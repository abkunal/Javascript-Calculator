class Calculator {
  constructor() {
    this._string = "0";
    this._current = "0";
    this._evaluated = false;
  }

  getAll() {
    return [this._string, this._current];
  }

  getString() {
    return this._string;
  }

  getCurrent() {
    return this._current;
  }

  isOperator() {
    var a = this._current;
    if (a == "+" || a == "-" || a == "/" || a == "*")
    return true
    return false;
  }

  clearAll() {
    this._string = "0";
    this._current = "0";
  }

  clearEntry() {
    this._string = this._string.slice(0, - this._current.length);
    this._current = "0";
    if (this._string == "")
      this._string = "0";
  }

  deleteLastNumber() {
    this._string = this._string.slice(0, -1);
    this._current = this._current.slice(0, -1);
    if (this._string == "") {
      this._string = "0";
      this._current = "0";
    }
  }

  addNum(num) {
    // if equals is pressed and a new number is entered
    // start new calculation
    if (this._evaluated == true) {
      this._string = "";
      this._current = "";
      this._evaluated = false;
    }
    // if number is entered after an operator
    if (this.isOperator())
      this._current = num.toString();
    else {
      // base value
      if (this._current == "0") {
        this._current = num.toString();
      }
      else {
        this._current = this._current + num.toString();
      }
    }
    if (this._string == "0") {
      this._string = num.toString();
    }
    else {
      this._string = this._string + num.toString();
    }

  }

  operator(opr) {
    // to allow chain evaluation
    if (this._evaluated == true) {
      this._string = this._current + opr.toString();
      this._evaluated = false;
    }
    else{
      // continuous operators pressed
      if (this.isOperator()) {
        this._string = this._string.slice(0, -1) + opr.toString();
      }
      else{
          this._string  = this._string + opr.toString();
      }
    }
    this._current = opr.toString();
  }

  evaluate() {
    // string not empty
    if (this._string !== "") {
      // Catch syntax Error
      try {
        var ans =  eval(this._string);
        ans = Math.round(ans * 100) / 100;
        this._current = ans.toString();
        this._string = this._string + "=" + ans.toString();
        this._evaluated = true;
        return ans;
      }
      catch (e) {
        if (e instanceof SyntaxError) {
          this._current = "";
          this._string = "";
          return false;
        }
      }
    }
  }
}

calc = new Calculator();

class Display {
  constructor() {
    this._calc = new Calculator();
  }

  display() {
    $("#sofar").html(this._calc.getString());
    $("#current").html(this._calc.getCurrent())
  }

  pressClearEntry() {
    this._calc.clearEntry();
    this.display()
  }

  pressClearAll() {
    this._calc.clearAll();
    this.display();
  }

  pressDelete() {
    this._calc.deleteLastNumber();
    this.display();
  }

  pressNumber(num) {
    this._calc.addNum(num);
    if (this._calc.getCurrent().length > 19) {
      alert("Digit Limit Reached!");
      this.pressClearAll();
    } else {
      this.display();
    }
  }

  pressOperator(opr) {
    this._calc.operator(opr);
    this.display();
  }

  pressEqual() {
    var ans = this._calc.evaluate();
    if (ans == false) {
      this.display();
      $("#current").html("Syntax Error");
    }
    else {
      this.display();
      $("#current").html(ans);
    }
  }
}

mappings = {"id": "value"}

function isOperator(id){
  if (id == "plus" || id == "minus" || id == "mul" || id == "div")
    return true;
  return false;
}

$("document").ready(function() {
  d = new Display();
  d.display();
  $("button").on('click', function() {
    var id = this.id;

    if (id == "clear-entry"){
      d.pressClearEntry();
    }
    else if (id == "clear-all") {
      d.pressClearAll();
    }
    else if (id == "delete") {
      d.pressDelete();
    }
    else if (id == "equals") {
      d.pressEqual();
    }
    else if (isOperator(id)) {
      d.pressOperator($(this).val());
    }
    else {
      d.pressNumber($(this).val());
    }
  });
  
  $(document).keypress(function(e) {
    var code = e.which;
    
    if (code >= 48 && code <= 57) {
      d.pressNumber(String.fromCharCode(code));
    }
    else if (code == 43 || code == 42 || code == 45 || code == 47) {
      d.pressOperator(String.fromCharCode(code));
    }
    else if (code == 13) {
      d.pressEqual();
    }
  });

  $(document).keydown(function(e) {
    if (e.which == 8) {
      d.pressDelete();
    }
  });
  
});

$(".small, .large").mouseup(function() {
  this.blur();
});