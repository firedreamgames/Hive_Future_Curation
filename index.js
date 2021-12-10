var hive = require('@hiveio/hive-js');
const { NOTINITIALIZED } = require('dns');
const fs = require("fs");
const { csv2json } = require('json-2-csv');
const { calculateVotes } = require('./functions');
var functions=require('./functions')
const wif="YOUR POSTING KEY"
let noTime=0;
let startingFunc=(voter,percent,cb)=>{
	functions.getVotes(voter,function(result){
		let a=[]
		let x=1;
		let total=0
		//console.log(result.length)
		//console.log(result)
		function recurse(){
			try{
			let curation_total=0
			functions.calculateVotes(result[x].author,result[x].permlink,result[x].timestamp,result[x].rshares,function(cb){
				
				let link="https://hive.blog/@"+result[x].author+"/"+result[x].permlink
				if(isNaN(cb.curation)) cb.curation=0
				a.push({
					"author":result[x].author,
					"perm":result[x].permlink,
					"rshares":result[x].rshares,
					"link":link,
					"vote_time":result[x].timestamp,
					"post_time":cb.post_time,
					"curation":cb.curation
				});
				
				total=parseFloat(total)+parseFloat(cb.curation);
				//remove element if curation is zero
				if(parseFloat(cb.curation)==0){a.pop()}
				
				console.log(x)
				console.log(total)
				/*
				console.log(link)
				console.log(cb.curation)
				*/
				x+=1;
				if(cb.post_time==-1){
					x-=1
				}
				
				
				if(x==result.length){
					calculateResult(a)
					//console.log(a)
					//console.log(a.length)
					console.log("Total Earning",total)
					}
				
				if(x<result.length){  //result.length
				recurse();
				}
				
		});
		}
		catch(e){
			console.log("SHIT"+e)

		}
		}
		recurse();
		
		
		
	})

	let calculateResult=(a)=>{
		hive.api.getRewardFund("post", function(err,result){
			let ratio=parseInt(result.reward_balance)/parseInt(result.recent_claims);
			let upvote_total=0
			let curation_total=0
			//console.log(err,result)
			let finalArray=[]
			for (let x=0;x<a.length;x++){
				let upvote_value=parseFloat(a[x].rshares*ratio);
				upvote_total=upvote_total+upvote_value;
				curation_total=curation_total+parseFloat(a[x].curation);
				console.log(curation_total)
				let efficiency=parseFloat(a[x].curation/upvote_value)*100
				let payDay_stamp=parseInt(new Date(a[x].post_time).getTime())+604800000;
				let payDay=new Date(payDay_stamp);
				console.log(a[x].link)
				console.log("upvote: ",upvote_value)
				console.log("curtion: ",a[x].curation)
				console.log("efficiency: %",efficiency)
				console.log("pay day: ",payDay)
				finalArray.push
				({
					"link":a[x].link,
					"upvote_value":upvote_value,
					"curation_value":parseFloat(a[x].curation),
					"efficiency":efficiency,
					"pay_day":payDay

				})


				
			}
			
			finalArray.sort((a, b) =>(a.efficiency-b.efficiency));
			let leastEfficient=finalArray[0]
			let mostEfficient=finalArray[finalArray.length-1]
			finalArray.sort((a, b) =>(a.pay_day-b.pay_day));
			let firstPaymentDay=finalArray[0].pay_day
			let lastPaymentDay=finalArray[finalArray.length-1].pay_day
			console.log(upvote_total)
			console.log(curation_total)
			console.log("efficiency Total: %",(curation_total/upvote_total)*100)
			console.log(mostEfficient)
			console.log(leastEfficient)
			let message1=("Dear @"+voter+"\n"+
			"Thank you for your"+percent/100+"% upvote."+"\n"+
			"During your last 1000 activities you have upvoted "+finalArray.length+" posts."+"\n"+
			"Your total upvote value is: "+upvote_total.toFixed(3)+" HIVE"+"\n"+
			"The estimated total curation reward you will earn from your upvotes is: "+curation_total.toFixed(3)+" HIVE"+"\n"+
			"This reward will be paid between"+"\n"+
			firstPaymentDay+"\n"+
			"and "+"\n"+
			lastPaymentDay+"\n"+
			"Total efficiency of your upvotes is: %"+((curation_total/upvote_total)*100).toFixed(2)+"\n"+
			"\n"+
			"Your most efficient upvote is"+"\n"+
			"Link: "+mostEfficient.link+"\n"+
			"upvote value: "+mostEfficient.upvote_value.toFixed(4)+" HIVE"+"\n"+
			"estimated curation: "+mostEfficient.curation_value.toFixed(4)+" HIVE"+"\n"+
			"efficiency: %"+mostEfficient.efficiency.toFixed(2)+"\n"+
			"\n"+
			"Your least efficient upvote is"+"\n"+
			"Link: "+leastEfficient.link+"\n"+
			"upvote value: "+leastEfficient.upvote_value.toFixed(4)+" HIVE"+"\n"+
			"estimated curation: "+leastEfficient.curation_value.toFixed(4)+" HIVE"+"\n"+
			"efficiency: %"+leastEfficient.efficiency.toFixed(2)+"\n")

			let message2=("Dear @"+voter+"\n"+
			"Sorry to see you downwoted my post."+"\n"+
			"No offence :) Below is your estimated future curation"+"\n"+
			"During your last 1000 activities you have upvoted "+finalArray.length+" posts."+"\n"+
			"Your total upvote value is: "+upvote_total.toFixed(3)+" HIVE"+"\n"+
			"The estimated total curation reward you will earn from your upvotes is: "+curation_total.toFixed(3)+" HIVE"+"\n"+
			"This reward will be paid between "+firstPaymentDay+" and "+lastPaymentDay+"\n"+
			"Total efficiency of your upvotes is: %"+((curation_total/upvote_total)*100).toFixed(2)+"\n"+
			"\n"+
			"Your most efficient upvote is"+"\n"+
			"Link: "+mostEfficient.link+"\n"+
			"upvote value: "+mostEfficient.upvote_value.toFixed(4)+" HIVE"+"\n"+
			"estimated curation: "+mostEfficient.curation_value.toFixed(4)+" HIVE"+"\n"+
			"efficiency: %"+mostEfficient.efficiency.toFixed(2)+"\n"+
			"\n"+
			"Your least efficient upvote is"+"\n"+
			"Link: "+leastEfficient.link+"\n"+
			"upvote value: "+leastEfficient.upvote_value.toFixed(4)+" HIVE"+"\n"+
			"estimated curation: "+leastEfficient.curation_value.toFixed(4)+" HIVE"+"\n"+
			"efficiency: %"+leastEfficient.efficiency.toFixed(2)+"\n")

			if(percent>0){
				cb(message1)
			}
			if(percent<0){
				cb(message2)
			}







			});



	}
}



function initialize(){

	let replied=[]
	let oneVoter=[];
	let onePercent=[];

	console.log("started")
	hive.api.getContentReplies("firedream", "test-post", function(err, result) {
		console.log(result)
		for(let i=0; i<parseInt(result.length);i++){
			let str=result[i].body   
			let stralt=str.split('Dear @').pop().split('\n')[0];
			replied.push(stralt)
			console.log(replied)
		}
		hive.api.getActiveVotes("firedream", "test-post", function(err, result) {
			console.log("here")
			
	
			for (let i = 0; i <parseInt(result.length); i++) {    
						
				if(!(replied.includes(result[i].voter))){
				oneVoter.push(result[i].voter)
				onePercent.push(result[i].percent)
				}
								
			}
			console.log(oneVoter[0],onePercent[0])
			const permlink = Math.random()
                        .toString(36)
                        .substring(2);
			startingFunc(oneVoter[0],onePercent[0],function(cb){
				
				hive.broadcast.comment(wif, "firedream","test-post" , "firedream",permlink, "", cb, "", function(err, result) {
					console.log(err, result);
                    if (result){
                        noTime=1;
                        setTimeout(function timer() {
                            initialize()             
                        }, 15000);
                        
                        
                    }
				});
			})		
		})
	})
    if (noTime=0){
        setTimeout(function timer() {
            initialize()             
        }, 600000);
    }
}
initialize()
