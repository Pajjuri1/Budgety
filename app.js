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

  
    var data = {
        allItems: {
            exp:[],
            inc:[]
        },

        totals:{
            exp:0,
            inc:0
        }
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
        expenseContainer:'.expenses__list'
    };


    return {
        getInput : function(){
            return {
            type : document.querySelector(DOMstrings.inputtypye).value, // will get inc or exc
            description : document.querySelector(DOMstrings.inputdescription).value,
            value : document.querySelector(DOMstrings.inputvalue).value
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
            fields = document.querySelectorAll(DOMstrings.inputdescription+ ', ' + DOMstrings.inputvalue);

            fieldsArray= Array.prototype.slice.call(fields);

            fieldsArray.forEach(function(){
                
            });
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

    

    

    function ctrlAddItem (){
        // 1 .get the field input data
        var input,newItem;
        input = uc.getInput();
    
        // 2. Add item to the budget control
        newItem=bc.addItem(input.type,input.description,input.value);
        //3. Add the item to the user interface
        uc.addListItem(newItem,input.type); 
        
        
        //4. Calculate the budet.
        //5. Display the budget.
    

    } 

    return{
        init : function(){
            console.log('Application has started!!');
            setupEventListeners();
        }

        
    };

})(budgetController,uiControler);


controller.init();