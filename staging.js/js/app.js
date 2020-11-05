

class Effect {
    constructor(effectClass, targetClass){
        this.effectClass = effectClass;
        this.targetClass = targetClass;
        this.onClass = targetClass + "-on";
        this.offClass = targetClass+"-off";
        this.to.bind(this);
        this.off.bind(this);
        this.on.bind(this);
    }

    to(sel){
        $(sel).each((i, o)=>{
            if ($(o).hasClass(this.onClass)) this.off(o);
            else  this.on(o);
        });
    }
    off(sel){
        $(sel).each((i,o)=>{
            $(o).removeClass(this.effectClass + " " + this.onClass).addClass(this.effectClass + " " + this.offClass);
        })
    }
    on(sel){
        $(sel).each((i, o) =>{
            $(o).removeClass(this.effectClass + " " + this.offClass).addClass(this.effectClass + " " + this.onClass);
        });
    }
};

var appearEffect = new Effect("effect", "appear");
var hideEffect = new Effect("effect", "hide");

class App {
    constructor(){
        this.themeId = null;

        // adding event handlers
        $(".canvas")
            .on("click", function(event){
                if (!event.target.classList.contains('appear-off')) {
                    event.preventDefault();
                    if('img' == event.target.tagName) return;
                    myapp.placeImg(event.pageX, event.pageY);
                }

            })
            .on("dragover", function(event){event.preventDefault();})
            .on("dragend", function(event){event.preventDefault();});
        
        //setting preivew
        for ( var t of config.themes) {
            for (var caller of t.theme.callers){
                $(caller)
                    .on("click",function(e){
                        e.preventDefault();
                        //let meta = $.parseJSON($($(e.target).children('.meta-json').get(0)).text());
                        myapp.loadTheme(t.elementId);    
                    }).on("mouseover", function(e){
                        $(".preview-box").removeClass("right-origin left-origin").addClass( $(e.target).parent().hasClass('right')? "right-origin":"left-origin");
                        //TODO  this -> the current ".preview" how to apply this?
                        hideEffect.to([$(e.target).children('.preview-item')[0], $(e.target).children('.preview-bg')[0]]);
                    }).on("mouseout",function(e){
                        $(".preview-box").removeClass("right-origin left-origin")
                        hideEffect.to([$(e.target).children('.preview-item')[0], $(e.target).children('.preview-bg')[0]]);
                    });
            }
        }
        $("#close-theme-btn").on("click", function(){myapp.closeTheme();});
        $(".preview .right").addClass("right-aligned");
        $(".preview .left").addClass("left-aligned");
        $(".asset").css("display","none");

        // apply effects
        appearEffect.on(".preview-box");
        appearEffect.off(".canvas");
        hideEffect.on(["#theme-btn-box",".preview-item"]);
        hideEffect.off(".preview-bg");
    
        //bind
        this.loadTheme.bind(this);
        this.closeTheme.bind(this);
        this.applyEffect.bind(this);
        this.placeImg.bind(this);
        this.draggable.bind(this);
        this.moveImg.bind(this);
    
    }

    loadTheme(id){    
        this.themeId = id;
        $(this.themeId).children('.drag-me').remove(); //remove all copied img
        this.applyEffect();
    }

    closeTheme(){
        this.applyEffect();
    }
    
    applyEffect(){
        appearEffect.to(".preview-box");
        appearEffect.to($(this.themeId));
        hideEffect.to("#theme-btn-box");
    }
    placeImg (x,y) {
        let sel = this.themeId + " img.asset";
        let i =  Math.round( Math.random() * (($(sel).length) - 1) );
        let obj = $($(sel).get(i)).clone();
        $(this.themeId).append(obj);
        this.draggable(obj);
        obj.css("display", "block");
        this.moveImg(obj[0], x, y, true);
    }

    moveImg (img, x, y, transform){
        img.style.left =  x + "px";
        img.style.top =  y + "px";
    }

    draggable(obj) {
        $(obj).addClass('drag-me').removeClass("asset");
        $(obj).draggable = true;
        $(obj).on("dragenter", function(event){event.preventDefault();})
            .on("dragstart", function(event){
                var img = document.createElement('img')
                img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
                event.originalEvent.dataTransfer.setDragImage(img, 0, 0)
            })
            .on("drag", function(event){
                    event.preventDefault(); 
                myapp.moveImg(this, event.pageX, event.pageY);
            });
    }


};

//start
var myapp;
$(function(){
     myapp = new App();

});


/*

var appearEffect = new Effect("effect", "appear");
var hideEffect = new Effect("effect", "hide");

var themeId;

// global functions //////
var loadTheme = function(id){    
    themeId = id;
    $("#" + themeId).children('.drag-me').remove(); //remove all copied img
    applyEffect();
};

var closeTheme = function(){
    applyEffect();
};
var applyEffect = function(){
    appearEffect.to(".preview-box");
    appearEffect.to($("#" + themeId));
    hideEffect.to("#theme-btn-box");
};

$(function(){
    function placeImg(x,y) {
        let sel = "#" + themeId + " img.asset";
        let i =  Math.round( Math.random() * (($(sel).length) - 1) );
        let obj = $($(sel).get(i)).clone();
        $("#" + themeId).append(obj);
        draggable(obj);
        obj.css("display", "block");
        moveImg(obj[0], x, y, true);
     }

    function moveImg(img, x, y, transform){
        img.style.left =  x + "px";
        img.style.top =  y + "px";
       // if (transform) img.style.transform =  "translate(-50%, -50%)";
    }

    function draggable(obj) {
        $(obj).addClass('drag-me').removeClass("asset");
        $(obj).draggable = true;
        $(obj).on("dragenter", function(event){event.preventDefault();})
            .on("dragstart", function(event){
                var img = document.createElement('img')
                img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
                event.originalEvent.dataTransfer.setDragImage(img, 0, 0)
            })
            .on("drag", function(event){
                    event.preventDefault(); 
                moveImg(this, event.pageX, event.pageY);
            });
    }

    //init

    // adding event handlers
    $(".canvas")
        .on("click", function(event){
            if (!event.target.classList.contains('appear-off')) {
                event.preventDefault();
                if('img' == event.target.tagName) return;
                placeImg(event.pageX, event.pageY);
            }

        })
        .on("dragover", function(event){event.preventDefault();})
        .on("dragend", function(event){event.preventDefault();});
    $(".preview")
        .on("click",function(e){
            event.preventDefault()
            meta = $.parseJSON($($(e.target).children('.meta-json').get(0)).text());
            loadTheme(meta.themeId);    
        }).on("mouseover", function(e){
            $(".preview-box").removeClass("right-origin left-origin").addClass( $(e.target).parent().hasClass('right')? "right-origin":"left-origin");
            hideEffect.to([$(e.target).children('.preview-item')[0], $(e.target).children('.preview-bg')[0]]);
        }).on("mouseout",function(e){
            $(".preview-box").removeClass("right-origin left-origin")
            hideEffect.to([$(e.target).children('.preview-item')[0], $(e.target).children('.preview-bg')[0]]);
        });
    
    $("#close-theme-btn").on("click", function(){closeTheme();});
    $(".preview .right").addClass("right-aligned");
    $(".preview .left").addClass("left-aligned");


    $(".meta-json").css("display","none");
    $(".asset").css("display","none");
    appearEffect.on(".preview-box");
    appearEffect.off(".canvas");
    hideEffect.on(["#theme-btn-box",".preview-item"]);
    hideEffect.off(".preview-bg");


});
*/