var budgetController = (function(){

    var Expense = function(id, description , value){
        this.id=id;
        this.description=description;
        this.value=value;
        this.percentage = -1;

    };

    Expense.prototype.calcPerc = function(tot){
        if(tot>0){
        this.percentage = Math.round((this.value/tot) * 100);
        }else{
            this.percentage=-1;
        }
    }

    Expense.prototype.getPercentage = function(){
        return this.percentage;
    }

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

        deleteitem: function(type,id){
            var ids,index;
            
            ids= data.allItems[type].map(function(current){
                return current.id;

            });

            index= ids.indexOf(id);

            if(index !== -1){
                data.allItems[type].splice(index,1);
            }

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

        calculatePercentages : function(){
            data.allItems.exp.forEach(function(c){
                c.calcPerc(data.totals.inc);
            })
        },

        getPercentages: function(){
            var allprec = data.allItems.exp.map(function(c){
                return c.getPercentage();
            })

            return allprec;
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
        expensepercentage:".budget__expenses--percentage",
        container:".container",
        expperc:".item__percentage",
        month:".budget__title--month"

    };

    var formatNumber = function(num,type){
        num = Math.abs(num);
        num = num.toFixed(2);
        numsplit = num.split('.');
        int = numsplit[0];
        dec=numsplit[1];

        if (int.length > 3){
            int = int.substr(0,int.length - 3) + ',' + int.substr(int.length-3,3);
        }

        return (type === 'exp' ? '-' : '+') + ' '+ int +'.' + dec;
        };

    var nodeListforEach = function(list, callbackfunction){

            for (var i =0; i<list.length; i++){
                callbackfunction(list[i],i);
            }

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
            html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }else if (type==='exp'){
                element=DOMstrings.expenseContainer;
            html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            //Replace the place holder text with some actual data
            newHTML= html.replace('%id%',obj.id);
            newHTML=newHTML.replace('%description%',obj.description);
            newHTML=newHTML.replace('%value%',formatNumber(obj.value,type));


            //Insert HTML into the DOM

            document.querySelector(element).insertAdjacentHTML('beforeend',newHTML);


        },

        deleteListItem : function(selectorid){

            var element = document.getElementById(selectorid); 

            element.parentNode.removeChild(element);
            
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

            var type;

            obj.budget > 0 ? type = 'inc' : type='exp'

            document.querySelector(DOMstrings.budget).textContent= formatNumber(obj.budget,type);
            document.querySelector(DOMstrings.budgetincome).textContent= obj.totalincome;
            document.querySelector(DOMstrings.budgetexpense).textContent= obj.totalexpense;
            if (obj.perc > 0){
            document.querySelector(DOMstrings.expensepercentage).textContent= obj.perc;
            }
            else{

                document.querySelector(DOMstrings.expensepercentage).textContent= "---";

            }

        },

        displayPercentage : function(percentages){
            var fields = document.querySelectorAll(DOMstrings.expperc);

           
            
            nodeListforEach(fields, function(c,i){

                if(percentages[i]>0){

                c.textContent = percentages[i] + '%';
                } else {
                    c.textContent='---';
                }
                
            })
        },

        displayMonth : function(){
            var now = new Date();
            year = now.getFullYear();
            month=now.getMonth();
            months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
            document.querySelector(DOMstrings.month).textContent = months[month] + ' ' + year;
        },

        changedType : function(){
            var fields;
            fields =document.querySelectorAll(DOMstrings.inputtypye + ',' + DOMstrings.inputdescription + ',' + DOMstrings.inputvalue);
            
            nodeListforEach(fields, function(c){
                c.classList.toggle('red-focus');
            } );

            document.querySelector(DOMstrings.inputbutton).classList.toggle('red');
        
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

        document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);

        document.querySelector(DOM.inputtypye).addEventListener('change',uc.changedType);

    };

    
    var updateBudget = function(){
        //1. Calculates the budget
        bc.calculateBudget();   

        //2.Return the budget

        var budget = bc.getBudget();

        //3. Display the budget.
        uc.displayBudget(budget);
    }

    var updatePercentage = function(){

        //1. Calculate the precentages

        bc.calculatePercentages();

        //2.Read percentages from the budget controller

        var percentages = bc.getPercentages();  

        //3. Update the UI with the new percentages.

        uc.displayPercentage(percentages);
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

        //6.Update the precentages.
        updatePercentage();
        
        
        }
    

    } 

    function ctrlDeleteItem(event){
        var idelement,splitid;
        idelement = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if(idelement){
            splitid=idelement.split('-');
            type=splitid[0];
            id= parseInt(splitid[1]);

            //1. Delete the item from Data Structure

            bc.deleteitem(type,id);

            //2. Delete the item from UI

            uc.deleteListItem(idelement);

            //3.Re calculate the budget and update it on the UI

            updateBudget();

            //4. Update Percentages

            updatePercentage();

            
        }
    }

    return{
        init : function(){
            console.log('Application has started!!');
            setupEventListeners();
            uc.displayMonth();
            uc.displayBudget({budget : 0,
                totalincome : 0,
                totalexpense : 0,
                perc: -1});
        }

        
    };

})(budgetController,uiControler);


controller.init();