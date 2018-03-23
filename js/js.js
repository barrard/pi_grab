App = {
  address:{
    token:"0x409F8C0Bb2C9C278a51E9f0E0f38AD32F663415e",
    crowdsale:'0x4fed11DF20f85C1BBe0b19680773929C3172161a',
  },
  abi:{},
  contracts:{},

  init:function(){
    return App.initWeb3();

  },
  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      return
      // If no injected web3 instance is detected, fall back to Ganache
      // App.web3Provider = new Web3.providers.HttpProvider('http://192.168.0.93:8545');
      // App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
    }
    web3 = new Web3(App.web3Provider);
    web3.eth.getAccounts(function(e, r){
        console.log(r)
        $('#ethAccountID').html(r[0])
        if(r[0]==='0x038343bfaf1f35b01d91513c8472764d55474045'){
          $('#token_minting_owner').css({display:"block"});
        }
        App.account = r[0];
        try {
          web3.eth.getBalance(r[0].toString(),function(e, r){
          if(e){
            console.log(e)
            return
          }
          console.log(r.toNumber())
          $('#currentBalance').html(web3.fromWei(r.toNumber()))
          return App.initContract();

          })
        }catch (e){
          console.log(e)
        }
      })
  },
  initContract: function() {
    console.log('making contract')
    $.getJSON('js/token_abi.json', function(data) {
      App.abi.token = web3.eth.contract(data)
      App.contracts.token = App.abi.token.at(App.address.token)
      $.getJSON('js/crowdsale_abi.json', function(data) {
        App.abi.crowdsale = web3.eth.contract(data)
        App.contracts.crowdsale = App.abi.crowdsale.at(App.address.crowdsale)
        return App.setUI();

      });

    }); 

  },
  setUI:function(){
    //set data
    $('#crowdsale_address').text(App.address.crowdsale)

    App.contracts.token.balanceOf(App.address.crowdsale, function(e, r){
      if (e) {return}
        $('#tokens_available').text(3690-r)
    })
    App.contracts.crowdsale.owner(function(e, r){
      if (e) {return}
        $('#crowdsale_owner_address').text(r)
    })

    App.contracts.crowdsale.openingTime(function(e, r){
      if (e) {return}
        $('#crowdsale_creation_time').text(format_date_time_stamp(r*1000))

        App.contracts.crowdsale.closingTime(function(e, r){
          if (e) {return}
            setInterval(function(){
                var now = new Date().getTime();
              const closing_time = r*1000
              var time_left = closing_time - now

                $('#crowdsale_time_remaining').text(format_date_time_remaining(time_left))
            }, 1000)
        })
    })

    App.contracts.crowdsale.ethRaised(function(e, r){
      if (e) {return}
        // $('#tokens_sold').text(r)
      $('#crowdsale_eth_raised').text(web3.fromWei(r, 'ether'))

    })
    App.contracts.crowdsale.goal(function(e, r){
      if (e) {return}
        $('#crowdsale_goal').text(web3.fromWei(r, 'ether')+' ETH')
    })
    App.contracts.crowdsale.goalReached(function(e, r){
      if (e) {return}
        $('#crowdsale_goal_reached').text(r)
    })
    App.contracts.crowdsale.hasClosed(function(e, r){
      if (e) {return}
        $('#crowdsale_has_closed').text(r)
    })
    App.contracts.token.balanceOf(App.account, function(e, r){
      if (e) {return}
        $('#current_token_balance').text(r)
    })

    



    //click action
    $('#purchase_tokens_btn').on('click', function(){
      var _val = $('#number_of_tokens_to_buy').val()
      console.log('buying '+_val)
      activate_spinner('#block-spinner')

      // web3.eth.sendTransaction({
      App.contracts.crowdsale.buyTokens( _val,{
        from:web3.eth.coinbase,
        to:App.address.crowdsale,
        value:web3.toWei(_val*180, "finney")
      }, function(e, txHash){
        if(e){
          hide_spinner('#block-spinner')
          toastr.warning(e, 'Failed to send Ether')
          console.log(e)

        }else if(txHash){
          call_when_mined(txHash, function(){hide_spinner('#block-spinner')})

          toastr.success(txHash, 'Success! Your token is on it\'s way soon')
          console.log(txHash)
        }
        $('#sendEtherInLethalAmount').val('')
        $('#WeiView').html('')


      })
    })

    $('#mint_token_btn').on('click', function(){
      var _addr = $('#crowdsale_address_to_receive').val()
      var _val = $('#token_minting_amount').val()
      activate_spinner('#block-spinner')
      App.contracts.token.mint(_addr, _val, function(e, txHash){
        
        if(e){hide_spinner('#block-spinner');return}
          console.log(txHash)
          call_when_mined(txHash, function(){hide_spinner('#block-spinner')})
        

        $('#crowdsale_address_to_receive').val('')
        $('#token_minting_amount').val('')

      })
    })


  }
}




$(function() {
  $(window).on('load', function() {
    console.log('load')
    App.init();
    initMap()
  });
});
