

var page = "main"
selectedpart = "guns"
ItemList = {}
Basket = {}
BasketTotal = 0
PlayerMoney = 0
InterVal = 0
Discount = 0
opened = false
audioPlayer = undefined
window.addEventListener('message', function(event) {
    if (event.data.message == "Open") {
        opened = true
        $("#main").fadeIn(300)
        ItemList = event.data.Data
        PlayerInfo = event.data.PlayerInfo
        InterVal = event.data.IntervalTime 
        PlayerMoney = PlayerInfo.cash
        $(".charname").html(event.data.Name)
        $(".topcharname").html(PlayerInfo.charname)
        $(".topmoney").html("$"+PlayerInfo.cash)
        $(".topdesc").html("Welcome "+PlayerInfo.charname+", you can transform your dirty money to clean money with this system. Please be aware that in order to cleanify the money hackers will get %"+event.data.Discount+" of it.")
        $(".laund-info-text").html("Please be  aware that in order to cleanify the  money hackers will get %"+event.data.Discount+" of it.<br> Your money will be transfered to your bank.")
        Discount = event.data.Discount
        calc = (Number(PlayerInfo.dirtymoney) * Number(event.data.Discount) / 100)
        calcl = Number(PlayerInfo.dirtymoney - calc)
        $(".earnmoney").html("$"+Math.floor(calcl))
        $(".calcmoney").html("$"+PlayerInfo.dirtymoney)
        $(".profile").html("<img src="+PlayerInfo.photo+">")
        SetBasketTotal()
        if (selectedpart == "guns") {
            ListSelectedPart("guns")
        }
        
    } else if (event.data.message == "refreshmoney") {
        $(".earnmoney").html("$0")
    } else if (event.data.message == "whileloop") {
        if (opened) {
            audioPlayer = new Audio("./img/ring.ogg");
            audioPlayer.volume = 0.15;
            audioPlayer.play();
        }

        $(".calcmoney").html("$"+event.data.money)
        $(".earnmoney").html("$"+event.data.earned)
        if (event.data.status) {
            calc = (Number(PlayerInfo.dirtymoney) * Number(Discount) / 100)
        calcl = Number(PlayerInfo.dirtymoney - calc)
        $(".earnmoney").html("$"+Math.floor(calcl))
        $(".calcmoney").html("$"+PlayerInfo.dirtymoney)
        $(".cleanmnydiv").html(`
        <p class="w-[80%] h-full cleanmoney justify-center items-center flex" style="border-bottom: 1px solid white; " onclick="CleanMoney()">CLEAN MY MONEY</p>
    `)
        $(".cleanmnydiv").css("background", "rgba(167, 213, 255, 0.13)")
        }
    } else if (event.data.message == "stopprogress") {
        calc = (Number(PlayerInfo.dirtymoney) * Number(Discount) / 100)
        calcl = Number(PlayerInfo.dirtymoney - calc)
        $(".earnmoney").html("$"+Math.floor(calcl))
        $(".calcmoney").html("$"+PlayerInfo.dirtymoney)
        $(".cleanmnydiv").html(`
            <p class="w-[80%] h-full cleanmoney justify-center items-center flex" style="border-bottom: 1px solid white; " onclick="CleanMoney()">CLEAN MY MONEY</p>
        `)
        $(".cleanmnydiv").css("background", "rgba(167, 213, 255, 0.13)")
    } else if (event.data.message == "notify") {
        Notify(event.data)
    }
});

Notify = function(data) {
    if (data.type) {
        $(".rectdiv").css({'display':'block'}).animate({
            left: 250+"vh",
        }, 800);
        if (data.type == "error") {
            $(".notifycontainer").html(`
                <div class="w-full h-full flex bg-[url(./img/error-group.png)] bg-no-repeat bg-cover bg-center justify-center items-center" >
                    <div class="w-[40%] h-full flex justify-end" >
                        <div class="w-[80%] h-full flex flex-col gap-2 justify-center items-center" >
                            <div class="w-full h-[40%] err flex items-center">ERROR!</div>
                            <div class="w-full h-[60%] errdesc flex items-center">`+data.messagen+`</div>
                        </div>
                    </div>
                </div>
            `)
            $(".notifycontainer").css({'display':'block'}).animate({
                left: "5vh",
            }, 600, function(){
                setTimeout(function() {
                    $(".notifycontainer").hide();
                    $(".notifycontainer").css("left", "250vh")
                    $(".rectdiv").css({'display':'block'}).animate({
                        left: "5vh",
                    }, 800);
                }, 2000);
            });
        } else if (data.type == "success") {
            $(".notifycontainer").html(`
            <div class="w-full h-full flex bg-[url(./img/success-group.png)] bg-no-repeat bg-cover bg-center justify-center items-center" >
                    <div class="w-[40%] h-full flex justify-end" >
                        <div class="w-[80%] h-full flex flex-col gap-2 justify-center items-center" >
                            <div class="w-full h-[40%] suc flex items-center">SUCCESS!!</div>
                            <div class="w-full h-[60%] sucdesc flex items-center">`+data.messagen+`</div>
                        </div>
                    </div>
                </div>
            `)
            $(".notifycontainer").css({'display':'block'}).animate({
                left: "5vh",
            }, 600, function(){
                setTimeout(function() {
                    $(".notifycontainer").hide();
                    $(".notifycontainer").css("left", "250vh")
                    $(".rectdiv").css({'display':'block'}).animate({
                        left: "5vh",
                    }, 800);
                }, 2000);
            });
        }
    }
}
 
ChangePage = function() {
    if (page == "main") {
        $(".marketpage").hide();
        $(".rightcont").hide();
        $(".laundring-page").hide();
        $(".washmoneytext").html("BLVCK MVRKT")
        page = "laund"
    } else if(page == "laund") {
        $(".laundring-page").hide();
        $(".marketpage").show();
        $(".rightcont").show();
        $(".washmoneytext").html("WASH MY MONEY")
        page = "main"
    }
}

SelectPart = function(id) {
    if (selectedpart == id) {
        return
    }
    $("."+selectedpart).removeClass("selectedgroup")
    $("."+selectedpart).find(".parts").removeClass("selected")
    $("."+id).addClass("selectedgroup")
    $("."+id).find(".parts").addClass("selected")
    selectedpart = id
    ListSelectedPart(id)
}


SetBasketTotal = function() {
    $(".totalcost").html("Total - $"+BasketTotal)
}

ListSelectedPart = function(id) {
    $(".itemshw").html("")
    if (id == "guns") {
        $.each(ItemList["Guns"], function(index, valuet){
            $(".itemshw").prepend(`
            <div class="w-[22%] h-[35%] flex justify-center items-center itemlist " id='Guns' data=`+valuet.itemname+` label=`+valuet.itemlabel+` price=`+valuet.price+`>
                            <div class="w-[90%] h-[80%] bg-[url(./img/border.png)] bg-cover bg-no-repeat flex justify-center items-center" id=`+valuet.itemname+`>
                                <div class="w-[90%] h-[90%] flex bg-[url(./img/inherit.png)] hover:bg-[url(./img/selected-item.png)] bg-center bg-cover items-center flex-col">
                                    <div class="w-[80%] h-[25%] flex justify-center items-center itemprice" style="border-bottom: 1px solid gray;">
                                        $`+valuet.price+`
                                    </div>
                                    <div class="w-full h-[60%] flex justify-center items-center">
                                        <img src="https://raw.githubusercontent.com/Aviradim/Evolve-IMGS/main/inventory_images/`+valuet.image+`">
                                    </div>
                                    <div class="w-full h-[20%] flex justify-center items-center itemname">
                                    `+valuet.itemlabel+`
                                    </div>
                                </div>
                            </div>
                        </div>
            `)
        })
    } else if (id == "ammos") {
        $.each(ItemList["Ammos"], function(index, valuet){
            $(".itemshw").prepend(`
            <div class="w-[22%] h-[35%] flex justify-center items-center itemlist" id='Ammos' data=`+valuet.itemname+` label=`+valuet.itemlabel+` price=`+valuet.price+`>
                            <div class="w-[90%] h-[80%] bg-[url(./img/border.png)] bg-cover bg-no-repeat flex justify-center items-center" id=`+valuet.itemname+`>
                                <div class="w-[90%] h-[90%] flex bg-[url(./img/inherit.png)] hover:bg-[url(./img/selected-item.png)] bg-center bg-cover items-center flex-col">
                                    <div class="w-[80%] h-[25%] flex justify-center items-center itemprice" style="border-bottom: 1px solid gray;">
                                        $`+valuet.price+`
                                    </div>
                                    <div class="w-full h-[60%] flex justify-center items-center">
                                        <img src="https://raw.githubusercontent.com/Aviradim/Evolve-IMGS/main/inventory_images/`+valuet.image+`">
                                    </div>
                                    <div class="w-full h-[20%] flex justify-center items-center itemname">
                                    `+valuet.itemlabel+`
                                    </div>
                                </div>
                            </div>
                        </div>
            `)
        })
    } else if (id == "drugs") {
        $.each(ItemList["Drugs"], function(index, valuet){
            $(".itemshw").prepend(`
            <div class="w-[22%] h-[35%] flex justify-center items-center itemlist" id='Drugs' data=`+valuet.itemname+` label=`+valuet.itemlabel+` price=`+valuet.price+`>
                            <div class="w-[90%] h-[80%] bg-[url(./img/border.png)] bg-cover bg-no-repeat flex justify-center items-center" id=`+valuet.itemname+`>
                                <div class="w-[90%] h-[90%] flex bg-[url(./img/inherit.png)] hover:bg-[url(./img/selected-item.png)] bg-center bg-cover items-center flex-col">
                                    <div class="w-[80%] h-[25%] flex justify-center items-center itemprice" style="border-bottom: 1px solid gray;">
                                        $`+valuet.price+`
                                    </div>
                                    <div class="w-full h-[60%] flex justify-center items-center">
                                        <img src="https://raw.githubusercontent.com/Aviradim/Evolve-IMGS/main/inventory_images/`+valuet.image+`">
                                    </div>
                                    <div class="w-full h-[20%] flex justify-center items-center itemname">
                                    `+valuet.itemlabel+`
                                    </div>
                                </div>
                            </div>
                        </div>
            `)
        })
    } else if (id == "devices") {
        $.each(ItemList["Devices"], function(index, valuet){
            $(".itemshw").prepend(`
            <div class="w-[22%] h-[35%] flex justify-center items-center itemlist" id='Devices' data=`+valuet.itemname+` label=`+valuet.itemlabel+` price=`+valuet.price+`>
                            <div class="w-[90%] h-[80%] bg-[url(./img/border.png)] bg-cover bg-no-repeat flex justify-center items-center" id=`+valuet.itemname+`>
                                <div class="w-[90%] h-[90%] flex bg-[url(./img/inherit.png)] hover:bg-[url(./img/selected-item.png)] bg-center bg-cover items-center flex-col">
                                    <div class="w-[80%] h-[25%] flex justify-center items-center itemprice" style="border-bottom: 1px solid gray;">
                                        $`+valuet.price+`
                                    </div>
                                    <div class="w-full h-[60%] flex justify-center items-center">
                                        <img src="https://raw.githubusercontent.com/Aviradim/Evolve-IMGS/main/inventory_images/`+valuet.image+`">
                                    </div>
                                    <div class="w-full h-[20%] flex justify-center items-center itemname">
                                    `+valuet.itemlabel+`
                                    </div>
                                </div>
                            </div>
                        </div>
            `)
        })
    }
}

$(document).on("click",".itemlist",function() {
    type = $(this).attr("id")
    itemname = $(this).attr("data")
    label = $(this).attr("label")
    price = $(this).attr("price")
    price = Number(price)
    var amount = 1
    if (Basket[type]) {
        if (Basket[type][itemname]) {
            Basket[type][itemname] = Basket[type][itemname] + 1
            $(".overflow-menu-basket").find('[id='+itemname+']').find(".amount").html('x'+Basket[type][itemname])
            $(".overflow-menu-basket").find('[id='+itemname+']').find('.order-price').html('$'+price*Basket[type][itemname])
            BasketTotal = BasketTotal + price
            SetBasketTotal()
            return
        }
    }
    if (type) {
        if (Basket[type] == undefined) {
            Basket[type] = {}
        }
        BasketTotal = BasketTotal + price
        SetBasketTotal()
        Basket[type][itemname] = amount
        $(".overflow-menu-basket").prepend(`
        <div class="w-full h-[17.5%] flex justify-between mt-2 listbasket" id=`+itemname+`>
            <div class="w-[25%] h-full bg-[url(./img/order-item.png)] bg-cover bg-no-repeat order-item-name flex justify-center items-center" >
                `+label+`
            </div>
            <div class="w-[60%] h-full items-center justify-center flex" >
                <div class="w-[30%] h-full flex order-price justify-center items-center" >
                    $`+price+`
                </div>
                <div class="w-[30%] h-[100%] flex bg-cover  ml-1 bg-no-repeat bg-center order-add justify-end items-center" item=`+itemname+` type=`+type+` price=`+price+`>
                    <img src="./img/order-add.png" class="mt-2" style="object-fit: scale-down;">
                </div>
                <div class="w-[20%] h-full flex justify-center items-center amount">x`+amount+`</div>
                <div class="w-[30%] h-[100%] flex bg-cover  ml-1 bg-no-repeat bg-center order-dec  items-center" item=`+itemname+` type=`+type+` price=`+price+`>
                    <img src="./img/order-dec.png" class="mt-2" style="object-fit: scale-down;">
                </div>
            </div>
        </div>
        `)
    }
});

$(document).on("click",".order-add",function() {
    itemname = $(this).attr("item")
    type = $(this).attr("type")
    price = $(this).attr("price")
    price = Number(price)
    if (type) {
        if (Basket[type][itemname]) {
            Basket[type][itemname] = Basket[type][itemname] + 1
            $(".overflow-menu-basket").find('[id='+itemname+']').find(".amount").html('x'+Basket[type][itemname])
            $(".overflow-menu-basket").find('[id='+itemname+']').find('.order-price').html('$'+price*Basket[type][itemname])
            BasketTotal = BasketTotal + price
            SetBasketTotal()
        }
    }
});

$(document).on("click",".order-dec",function() {
    itemname = $(this).attr("item")
    type = $(this).attr("type")
    price = $(this).attr("price")
    price = Number(price)
    if (type) {
        if (Basket[type][itemname]) {
            if (Basket[type][itemname] -1 == 0) {
                BasketTotal = BasketTotal - price
                Basket[type][itemname] = undefined
                SetBasketTotal()
                return $(".overflow-menu-basket").find('[id='+itemname+']').remove();
            }
            BasketTotal = BasketTotal - price
            Basket[type][itemname] = Basket[type][itemname] -1
            $(".overflow-menu-basket").find('[id='+itemname+']').find(".amount").html('x'+Basket[type][itemname])
            $(".overflow-menu-basket").find('[id='+itemname+']').find('.order-price').html('$'+price*Basket[type][itemname])
            SetBasketTotal()
        }
    }
});

Buy = function() {
    $.post('https://m-blackmarket/Buy', JSON.stringify({basket : Basket, totalcost : Number(BasketTotal)}));
    Basket = {}
    BasketTotal = 0
    ClearBasket()
    SetBasketTotal()
}

ClearBasket = function() {
    $(".overflow-menu-basket").html("")
}

CleanMoney = function() {
    if (Number(PlayerInfo.dirtymoney) > 0) {
        //$(".roll").html("<div class='loaddiv h-[20%]'></div>")
        // $(".loaddiv").css({'display':'block'}).animate({
        //     width: 100+"%",
        // }, Number(PlayerInfo.dirtymoney) * InterVal / 10);
        // calc = (Number(PlayerInfo.dirtymoney) * Number(Discount) / 100)
        // calcl = Number(PlayerInfo.dirtymoney - calc)
        // $(".earnmoney").html("$"+calcl)
        // $(".calcmoney").html("$"+PlayerInfo.dirtymoney)
        //   while (Number(PlayerInfo.dirtymoney) > 0) {
        //     console.log("while")
        //     PlayerInfo.dirtymoney = Number(PlayerInfo.dirtymoney) - 1;
        //     $(".calcmoney").html("$"+PlayerInfo.dirtymoney)
        //   }
        $(".cleanmnydiv").html(`
            <p class="w-[80%] h-full cleanmoney justify-center items-center flex" style="border-bottom: 1px solid #FFA7A7; color: #FFA7A7; " onclick="StopProcess()">STOP PROCESS</p>
        `)
        $(".cleanmnydiv").css("background", "#a0373775")
          $.post('https://m-blackmarket/StartLoop', JSON.stringify({money : PlayerInfo.dirtymoney}));  
          
        // setTimeout(function(){
        //     $.post('https://m-blackmarket/CleanMoney', JSON.stringify({}));
        //     $(".roll").html('<img src="./img/roll.png">')
        // }, InterVal);
    }

}

StopProcess = function() {
    $.post('https://m-blackmarket/StopProcess', JSON.stringify({}));  
}

$(document).on('keydown', function() {
    switch(event.keyCode) {
        case 27: // ESC
        opened = false
        $("#main").fadeOut(300)
        StopProcess()
            $.post("https://m-blackmarket/CloseUi", JSON.stringify({}));
            break;
        case 113: // ESC
        opened = false
        $("#main").fadeOut(300)
        StopProcess()
        $.post("https://m-blackmarket/CloseUi", JSON.stringify({}));
            break;
    }
});