var hive = require('@hiveio/hive-js');
const fs = require("fs");
const { builtinModules } = require('module');




module.exports={
   
    getAccounts:function(user,cb){
        hive.api.getAccounts(user, function(err, response){
         cb(response) 
            
        })
    },
    
   

    getVotes:function(voter,cb){
        let a=[{}];
        let perm=[];
        let limit=
        hive.api.getAccountHistory(voter, -1, 1,function(err, result) {
            //console.log(result["0"]["0"]);
            //console.log(result["0"]["1"].timestamp);
            
            let currentTime=Date.now();
           // console.log(Date.now()-new Date(result["0"]["1"].timestamp).getTime())
                hive.api.getAccountHistory(voter,(result["0"]["0"]-1), 1000,function(err, result2) {
                //console.log(result2[999][0]);
                //console.log(result2[0][1].timestamp);
                for(let x=0; x<result2.length;x++){
                    let voteTime=new Date(result2[x][1].timestamp).getTime();
                    if((result2[x][1].op[0]=="effective_comment_vote")&&(currentTime-voteTime<604800000)&&(result2[x][1].op[1].voter=voter)&&(!perm.includes(result2[x][1].op[1].permlink))){
                       
                        perm.push(result2[x][1].op[1].permlink)
                        a.push(
                            {
                                "timestamp":result2[x][1].timestamp,
                                "link": "https://hive.blog/@"+result2[x][1].op[1].author+"/"+result2[x][1].op[1].permlink,
                                "voter":result2[x][1].op[1].voter,
                                "author":result2[x][1].op[1].author,
                                "permlink":result2[x][1].op[1].permlink,
                                "weight":result2[x][1].op[1].weight,
                                "rshares":result2[x][1].op[1].rshares,
                                "total_weight":parseInt(result2[x][1].op[1].total_vote_weight)
                                

                            })
                            


                            
                    }
                   
                
                   
                }
                
                cb(a)
                
            });
            
                
          });


    },
    calculateVotes:function(author,permlink,timestamp,rshares,cb){
        let before=0;
        let after=0;
        
        hive.api.getContent(author, permlink, function(err, result) {
            //console.log(err)
            if(err){
                console.log("SHIT, try again")
                cb({
                    "curation":0,
                    "post_time":-1
                })
                
            }
            
            //nice json array sorting algorithm to sort voting time ascending --needed? NO :)
            result.active_votes.sort((a, b) =>new Date(a.time).getTime()-new Date(b.time).getTime());
           // calculate before and after rshares
        
            for(let x=0;x<result.active_votes.length;x++){
                
                if (new Date(result.active_votes[x].time).getTime()<new Date(timestamp).getTime()){
                before=before+result.active_votes[x].rshares
                }
                if (new Date(result.active_votes[x].time).getTime()>new Date(timestamp).getTime()){
                    after=after+result.active_votes[x].rshares
                }
            }
            let penalty=0;
            let postTime=new Date(result.created).getTime();
            let voteTime=new Date(timestamp).getTime();
            let timeAfter=(voteTime-postTime)/(1000*60)           
            //define penalty for voting
            if (timeAfter<=1){
                penalty=0
            }
            if ((timeAfter>1)&&(timeAfter<=2)){
                penalty=0.2
            }
            if ((timeAfter>2)&&(timeAfter<=3)){
                penalty=0.4
            }
            if ((timeAfter>3)&&(timeAfter<=4)){
                penalty=0.6
            }
            if ((timeAfter>4)&&(timeAfter<=5)){
                penalty=0.8
            }
            if (timeAfter>5){
                penalty=1
            }
            let ratio=((Math.sqrt(parseFloat(before)+parseFloat(rshares))-Math.sqrt(parseFloat(before)))/Math.sqrt(parseFloat(result.net_rshares)))*penalty
            /*
            console.log("before",before)
            console.log("rshares",rshares)
            console.log("total",result.net_rshares)
            console.log("penalty",penalty)
            console.log("ratio",ratio)
            console.log("pay",parseFloat(result.pending_payout_value.split(" ")[0]))
            */
            let hive_arr = result.pending_payout_value;
            let hivePay = parseFloat(hive_arr.split(" ")[0]);
            let curation=hivePay*ratio*0.5
           
            if(hivePay==0){curation=0}
            cb({
                "curation":curation,
                "post_time":result.created
            })
            
          });
        
          
    },

    
   

}


