var budgetController = (function(){

    var Expense = function(id, description , value){
        this.id=id;
        this.description=description;
        this.value=value;

    };

    var Income = function(id,description,value){
        this.id=id;
        this.description=description;
        this.value=value;
    };
    var calculateTotal = function(type){
        var sum=0;
        data.allItems[type].forEach(function(c){
            sum+=c.value;

        })
        data.totals[type]=sum;
        
    }
  
    var data = {
        allItems: {
            exp:[],
            inc:[]
        },

        totals:{
            exp:0,
            inc:0
        },

        budget : 0,
        percentage : -1
    }

    return {
        addItem: function(type,des,val){

            var newItem,ID;

            //create new ID 
            if (data.allItems[type].length>0){
            ID=data.allItems[type][data.allItems[type].length-1].id + 1;
            } else{
                ID=0; 
            }

            if (type==='exp'){

                newItem = new Expense(ID,des,val);

            } else if (type==='inc'){
                newItem = new Income(ID,des,val);
            }

            data.allItems[type].push(newItem);

            return newItem;

        },

        calculateBudget: function(){
            // Total Income & expense

            calculateTotal('inc');
            calculateTotal('exp');
            data.budget=data.totals.inc - data.totals.exp;

            if(data.totals.inc > 0){

            data.percentage= Math.round((data.totals.exp/data.totals.inc)*100); 

            }else{
                data.percentage= -1;
            }

            
        },

        getBudget: function(){
            return {
                budget : data.budget,
                totalincome : data.totals.inc,
                totalexpense : data.totals.exp,
                perc: data.percentage
            }
        }
    }


})();

var uiControler = (function(){
    var DOMstrings = {
        inputtypye : '.add__type',
        inputdescription: '.add__description',
        inputvalue: '.add__value',
        inputbutton:'.add__btn',
        incomeContainer: '.income__list',
        expenseContainer:'.expenses__list',
        budget : '.budget__value',
        budgetincome:'.budget__income--value',
        budgetexpense:'.budget__expenses--value',
        expensepercentage:".budget__expenses--percentage"

    };


    return {
        getInput : function(){
            return {
            type : document.querySelector(DOMstrings.inputtypye).value, // will get inc or exc
            description : document.querySelector(DOMstrings.inputdescription).value,
            value : parseFloat(document.querySelector(DOMstrings.inputvalue).value)
            };
        },

        getDOMstrings : function(){
            return DOMstrings;
        },



        addListItem: function(obj,type)
        {
            //Create HTML string with place holder text

            var element;

            if (type==='inc'){
            element=DOMstrings.incomeContainer;
            html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }else if (type==='exp'){
                element=DOMstrings.expenseContainer;
            html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            //Replace the place holder text with some actual data
            newHTML= html.replace('%id%',obj.id);
            newHTML=newHTML.replace('%description%',obj.description);
            newHTML=newHTML.replace('%value%',obj.value);


            //Insert HTML into the DOM

            document.querySelector(element).insertAdjacentHTML('beforeend',newHTML);


        },

        clearFields : function(){
            var fields,fieldsArray;
            fields = document.querySelectorAll(DOMstrings.inputdescription+ ', ' + DOMstrings.inputvalue);

            fieldsArray= Array.prototype.slice.call(fields);

            fieldsArray.forEach(function(c,i,a){
                c.value="";

            });

            fieldsArray[0].focus();
        },

        displayBudget: function(obj){

            document.querySelector(DOMstrings.budget).textContent= obj.budget;
            document.querySelector(DOMstrings.budgetincome).textContent= obj.totalincome;
            document.querySelector(DOMstrings.budgetexpense).textContent= obj.totalexpense;
            if (obj.perc > 0){
            document.querySelector(DOMstrings.expensepercentage).textContent= obj.perc;
            }
            else{

                document.querySelector(DOMstrings.expensepercentage).textContent= "---";

            }


        }
    };
})();

var controller =(function(bc,uc){

    var setupEventListeners = function(){

        var DOM = uc.getDOMstrings();
        document.querySelector(DOM.inputbutton).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress',function(ex){

        if (ex.keyCode === 13 || ex.which === 13){
            ctrlAddItem();
            }
    

        });

    };

    
    var updateBudget = function(){
        //1. Calculates the budget
        bc.calculateBudget();   

        //2.Return the budget

        var budget = bc.getBudget();

        //3. Display the budget.
        uc.displayBudget(budget);
    }
    

    function ctrlAddItem (){
        // 1 .get the field input data
        var input,newItem;
        input = uc.getInput();
        if(input.description !=="" && !isNaN(input.value) && input.value>0){
    
        // 2. Add item to the budget control
        newItem=bc.addItem(input.type,input.description,input.value);
        //3. Add the item to the user interface
        uc.addListItem(newItem,input.type); 

        // 4.Clearing input fields
        uc.clearFields();
        

        //5.Calculate and update the budget

        updateBudget();
        
        
        }
    

    } 

    return{
        init : function(){
            console.log('Application has started!!');
            setupEventListeners();
            uc.displayBudget({budget : 0,
                totalincome : 0,
                totalexpense : 0,
                perc: -1});
        }

        
    };

})(budgetController,uiControler);


controller.init();