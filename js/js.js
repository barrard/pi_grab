App = {
  address:{
    token:"0x41acb3dca09f738224adec8089845ed43276c55d", //saved
    crowdsale:'0x303cc55b6411560b7ce87572ea63c0bcbe75a918',//saved
    // token:"0xad930b6e063bae9fb8064ad30402b3c78711d3fb", 
    // crowdsale:'0x770b9e155598e73655a663f49499c2ac8d5ad276', 
  },
  abi:{},
  contracts:{},

  init:function(){
    return App.initWeb3();

  },
  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      console.log('check undefined')
      if(!web3.currentProvider.isMetaMask){
        $('#metaMask').css({'display':'block'})
        console.log('check meta')
        // var metaUrl = 'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en'
        // alert('this website is best used with MetaMask '+metaUrl)
      }
      web3.version.getNetwork((err, netId) => {
        if(netId!=4){
          $('#rinkebyRequired').css({display:'block'});
        }
      })
      // web3.version.getNetwork((err, netId) => {
      //   switch (netId) {
      //     case "1":
      //       console.log('This is mainnet')
      //       break
      //     case "2":
      //       console.log('This is the deprecated Morden test network.')
      //       break
      //     case "3":
      //       console.log('This is the ropsten test network.')
      //       break
      //     case "4":
      //       console.log('This is the Rinkeby test network.')
      //       break
      //     default:
      //       console.log('This is an unknown network.')
      //   }
      // })


    } else {
      $('#metaMask').css({'display':'block'})
      console.log(' meta is undefined?')

      return
      // If no injected web3 instance is detected, fall back to Ganache
      // App.web3Provider = new Web3.providers.HttpProvider('http://192.168.0.93:8545');
      // App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
    }
    web3 = new Web3(App.web3Provider);
    web3.eth.getAccounts(function(e, r){
        console.log(r)
        $('#ethAccountID').html(r[0])

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
        App.contracts.crowdsale.vault((e, r)=>{
          if(e){
            console.log(e);
            return
          }else{
            const vault_address = r;
            $.getJSON('js/refund_vault_abi.json', function(data) {
              App.abi.vault = web3.eth.contract(data)
              App.contracts.vault = App.abi.vault.at(vault_address)

              
              return App.setUI();

            });


          }
        })


      });

    }); 

  },
  setUI:function(){
    //set data
    $('#crowdsale_address').text(App.address.crowdsale)

    App.contracts.token.owner((e,r)=>{
      if(r==App.account){
        $('#token_minting_owner').show();
      }
    })


    App.contracts.crowdsale.owner(function(e, r){
      if (e) {return}
        $('#crowdsale_owner_address').text(r)
      if(App.account == r){
        $('#crowdsale_wallet_finalize').show();

      }
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
              if(time_left < 1){
                $('#crowdsale_wallet_finalize').show();

              }

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
        if(r==true){
          $('#End_crowd_sale').show();
        }
    })
    App.contracts.crowdsale.hasClosed(function(e, r){
      if (e) {return}
        $('#crowdsale_has_closed').text(r)
        if(r==true){
          $('#finalize_crowdsale').show();
        }

    })
    App.contracts.crowdsale.isFinalized(function(e, r){
      if (e) {return}
        $('#crowdsale_is_finalized').text(r)
        if(r==true){
          // $('#finalize_crowdsale').show();
          console.log('THIS CROWDSALE SHOULD BE OVER!!!!!!!!!')
        }

    })
    App.contracts.crowdsale.token_goal(function(e, r){
      if (e) {return}
        $('#tokens_needed').text(r)
      const _need = r;

        App.contracts.token.balanceOf(App.address.crowdsale, function(e, r){
          if (e) {return}
            $('#tokens_available').text(_need-r)
        })
    })
    App.contracts.token.balanceOf(App.account, function(e, r){
      if (e) {return}
        $('#current_token_balance').text(r)
    })

    



    //click action
    $('#finalize_crowdsale').on('click', ()=>{
      console.log('finalize it')
      App.contracts.crowdsale.finalize( (e, r)=>{
        if(e){
          console.log(e)
          return
        }else if(r){
          activate_spinner('#block-spinner')
          console.log(r)
          toastr.success('Finalizzed initiated')
          call_when_mined(r, function(){
            toastr.success('Finalizzed finished')
            hide_spinner('#block-spinner')

          })

        }else{
          console.log("WTFFFFFFFFF!!!!!!!!")
        }
    })
  })
    $('#End_crowd_sale').on('click', ()=>{
      console.log('end time limit')
      App.contracts.crowdsale.End_crowd_sale( (e, r)=>{
        if(e){
          console.log(e)
          return
        }else if(r){
          activate_spinner('#block-spinner')
          console.log(r)
          toastr.success('Ending timer')
          call_when_mined(r, function(){
            toastr.success('timer finished')
            hide_spinner('#block-spinner')

          })

        }else{
          console.log("WTFFFFFFFFF!!!!!!!!")
        }
    })
  })

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
          call_when_mined(txHash, function(){
            hide_spinner('#block-spinner')
          })
        

        $('#crowdsale_address_to_receive').val('')
        $('#token_minting_amount').val('')

      })
    })

    return App.set_watchers()

  },
  set_watchers:()=>{

   //  var Transfer_event = App.contracts.token.Transfer({}, {fromBlock:0, toBlock:'latest'})

   //  Transfer_event.watch(function(e, r){
   //    console.log('Transfer_event')
   //      if(e){
   //        console.log('error')
   //        console.log(e)
   //      }else if (r){
   //        // if(App.check_block(r)){
   //          console.log(r)
   
   // // from:"0x0000000000000000000000000000000000000000"
   // // to:"0xfc0d60268578ad8c9626747e030d9fcbc09d5115"
   // // value:r {s: 1, e: 2, c: Array(1)}

   //      }else{
   //        console.log('User_joined_event error')
   //      }
   //    })


    const token_events_array = [
      'Transfer'
      ,'OwnershipTransferred'
      ,'Approval'
    ]
    const refund_vault_events_array = [
       'Closed'
      ,'RefundsEnabled'
      ,'Refunded'
    ]
   const crowdsale_events_array =  [
       'OwnershipTransferred' 
      ,'TokenPurchase'
      ,'Finalized'
    ]
    
    const contracts_events_obj ={
      vault:refund_vault_events_array,
      token:token_events_array,
      crowdsale:crowdsale_events_array,
    }

    Object.keys(contracts_events_obj).forEach((i)=>{
      // console.log(`${i} : ${contracts_events_obj[i]}`)
      // console.log(contracts_events_obj[i])
      contracts_events_obj[i].forEach((event)=>{
        let event_event = App.contracts[i][event](
          {}, {fromBlock:0, toBlock:'latest'})
        event_event.watch(function(e, r){
          console.log(event+'_event');
          if(e){
            console.log('error')
            console.log(e)
          }else if (r){
            console.log(r)
          }
        })

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
