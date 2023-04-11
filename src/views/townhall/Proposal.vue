<template>
<div v-if = "loading"  style="width: 70%; height: 85%; display: flex; justify-content: center; vertical-align: middle; position: fixed; align-items: center; text-align: center;">

  <div>
    <img src="../../assets/loader.gif" alt="this slowpoke moves"  width="150" />
  </div>
</div>
<div v-else>
  <nav class="navbar navbar-expand-sm h-[65px]" style="border-bottom: 1px solid #d5d5d5">
    <div class="container-fluid">
      <label class="navbar-brand ps-5 pe-4 fs-5 fw-bolder" style="border-right: 2px solid #959595;">Proposal</label>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mynavbar">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="mynavbar">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <label  @click = "getProposalList(-1)" :class="index === -1?  'selected': ''" class="nav-link superwarden-nav" style="background-color: #fff">All</label>
          </li>
          <li class="nav-item">
            <label @click = "getProposalList(1)" :class="index === 1?  'selected': ''" class="nav-link superwarden-nav"  style="background-color: #fff">Active</label>
          </li>
          <li class="nav-item">
            <label  @click = "getProposalList(0)" :class="index === 0?  'selected': ''" class="nav-link superwarden-nav me-3" style="background-color: #fff">Important</label>
          </li>
          <li class="nav-item">
            <label @click = "getProposalList(2)" :class="index === 2?  'selected': ''" class="nav-link superwarden-nav " style="background-color: #fff">Complete</label>
          </li>
        </ul>
        <form class="d-flex me-4" v-if = "$store.getters.role < 4">
          <button @click="goCreateProposal" class="right-button px-3" type="button" >+Proposal</button>
        </form>
      </div>
    </div>
  </nav>
  

  <div v-if = "proposals.length > 0" class="right-section-content">

      <div @click="goProposalDetail(p._id)" class="block-container-proposal" v-for="(p) in proposals">
        <div class="my-2" style="display: flex;   justify-content: space-between;">
          <div style="display: flex; ">
            <p class="fw-bolder text-dark px-0 m-0 py-2" style="font-size: 22px;">{{trimmedProposalTitle(p.title)}}</p>
            <img v-if = "p.importance"   style="height: 35px;"   class="ms-2"    src="../../assets/staricon.png" />
          </div>
          <div class="my-2 " style="float: right;">
            <p v-if = "p.passed == 1" class="status active px-3">Active</p>
            <p v-else-if = "p.passed == 0" class="status complete px-3">Active</p>
            <p v-else class="status complete px-3">Complete</p>
          </div>
        </div>
        <span class="fw-bolder">Proposed by {{p.creator.name ? trimmedAccountNameAndLowercase(p.creator.name) +"." + p.slug: trimmedAccountAddress(p.creator.address) }}</span>
        <span class="text-dark" style="height: 100px;">{{trimmedAnnounceSummary(p.description)}}</span>
        <span class="valid-till"><img src="../../assets/clock-icon.png"/>Time left &nbsp;<img src="../../assets/line1.png"/> {{p.leftTime}}</span>
        <span class="cheak" v-if = "p.passed == 1"><img src="../../assets/uncheack.png" style="height: 25px;"/>Voting under process, result will be announced soon</span>
        <span class="cheak" v-else-if = "p.passed == 0"><img src="../../assets/uncheack.png" style="height: 25px;"/>Comming soon</span>
        <span class="cheak" v-else><img src="../../assets/cheack.png" style="height: 25px;"/>{{calculateWinner(p)}}</span>
      </div>
  </div>
  <div v-else class="right-section-no-content" :style="`min-height: ${height}px`">
    <img src="../../assets/townhall-quiet.png" />
    <span>Hmm... the townhall is so quiet. There are no active proposals currently.</span>
  </div> 

</div>
</template>
<script>
import moment from 'moment';
import FadeLoader from 'vue-spinner/src/FadeLoader.vue';

export default {
    name: "Proposal",
    components: {FadeLoader},
    data() {
        return {
          slug : this.$route.params['slug'],
          proposals: [],
          index : -1, //0: expecting 1: on process 2: passed, -1: all
          height: innerHeight - 210,
          loading: true,
        }
    },
    created() {this.getProposalList(-1)},
    mounted() {
      

        
    },
    methods: {
      trimmedAccountAddress(addr){
            if (addr.length > 10)
                return addr.slice(0, 5) + "..." + addr.slice(addr.length - 5, addr.length)
            else
                return addr
      },
      trimmedAccountNameAndLowercase(name){
        let string = name.replace(/[, ]+/g, "").trim().toLowerCase();
          if (string.length > 12)
              return string.slice(0, 9) + "..." + string.slice(string.length - 4, string.length)
          else
              return string
      },
      trimmedProposalTitle(title){
        if (title.length > 56)
            return title.slice(0, 56) + "..." 
          else
            return title
      },
      trimmedAnnounceSummary(summary){
        if (summary.length > 334)
            return summary.slice(0, 334) + "..." 
          else
            return summary
      },
      calculateWinner(p){
        if(p.quorum_status){
          let threshold = p.totalToken * p.percent / 100
          if (p.s_result && p.s_result.length > 0){
            if (p.s_result && (p.s_result[0].option > threshold))
              return p.s_result[0].option + ' is a winner'
          }
          if (p.result && p.result.length > 0){
            if (p.result && (p.result[0].option > threshold))
              return p.result[0].option + ' is a winner'
          }
          return 'N/A. Proposal do not meet the quorum threshold'
        } else {
          if (p.s_result && p.s_result.length > 0)
              return p.s_result[0].option + ' is a winner'
          if (p.result && p.result.length > 0)
              return p.result[0].option + ' is a winner'
          return 'N/A. Proposal does not have the result'
        }

      },
      goProposalDetail(_id){this.$router.push(`/proposal/detail/${_id}`)},


      goCreateProposal(){this.$router.push(`/proposal/create/${this.slug}`)},
        getProposalList(index){
          this.loading = true
          this.index = index
          api.getProposalList({slug : this.slug, index: this.index}, (res => {
            this.proposals = res.data.list
            // console.log(this.proposals)
            this.proposals.map((p) => {
              let now = new Date()
              let localTimeOffset = now.getTimezoneOffset() * 60 * 1000;
              let localTimeValue = now.getTime() + localTimeOffset
              let serverTimeOffset = moment().utcOffset(p.timezone.offset).utcOffset() * 60 * 1000
              let start_at_f = new Date(p.f_start_at);
              let startTimeValue = start_at_f.getTime() - serverTimeOffset + localTimeOffset
              let end_at_f = ''
              if (p.s_start_at)
                end_at_f = new Date(p.s_end_at);
              else
                end_at_f = new Date(p.f_end_at);
              let endTimeValue = end_at_f.getTime() - serverTimeOffset + localTimeOffset
              let toStart = startTimeValue - localTimeValue
              let toEnd = endTimeValue - localTimeValue



              
              if (toStart > 0){
                p.passed = 0
                p.leftTime = `Comming soon`
              } else if (localTimeValue > endTimeValue){
                p.passed = 2

                p.leftTime = `Finished`
                // console.log(p)
              } else {
                p.passed = 1
                let day = parseInt(toEnd/(1000 * 3600 * 24))
                let hour = parseInt((toEnd - day * 1000 * 3600 * 24)/(1000 * 3600))
                let minute = parseInt((toEnd - day * 1000 * 3600 * 24 - hour * 1000 * 3600)/(1000 * 60)) 
                // console.log(minute)

                p.leftTime = `${day} days ${hour} hours ${minute} minutes`
              }

            })
            this.loading = false

          }), err =>{
              console.log(err)
          })

      },
      
    }
}
</script>
<style>


.join-button {
  background: transparent;
  border: 1px solid rgba(148, 148, 148, 1);
  border-radius: 5px;
  padding: 5px;
  width: 150px;
}

.join-button span {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  font-size: 13.5px;
  color: #595959;
}

.nav-content {
  display: flex;
  flex-direction: column;
  padding: 15px;
  margin-top: 20px;
}

.nav-content span {
  padding: 5px 18px;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  font-size: 23px;
  color: #595959;
  border-radius: 5px;
}

.nav-content span:hover {
  background: #EEEEEE;
}

.nav-content img {
  height: 20px;
}

.nav-content span.active {
  background: #EEEEEE;
}

.nav-content span.disable {
  color: #959595;
}

.nav-content span.disable:hover {
  background-color: white;
}

.right-section {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 0px;
  overflow: hidden;
  /* border-right: 2px solid #D5D5D5; */
}




.right-section .head {
  /* width: 100%; */
  height: 80px;
  border-bottom: 1px solid #D5D5D5;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  column-gap: 20px;
}


.right-section>.head .options button {
  margin: 5px;
  width: 100px;
  border-radius: 5px;
  font-size: 15px;
  border: none;
  font-weight: 900;
}
.selected {
  border: 1px solid #595959 !important;
}


.right-button{
   background: rgba(220, 6, 43, 1) !important;
     border-radius: 25px;
       padding: 5px 10px;
         color: white;
         font-size: 13px;
         font-weight: 900;
}

.right-section .head .right-button-holder {
  display: flex;
  flex-grow: 1;
  justify-content: flex-end;
}

.right-section .head .right-button {
  background: rgba(220, 6, 43, 1);
  border-radius: 25px;
  color: white;
  padding: 5px 15px;
  border: none;
  font-family: Inter;
  font-weight: Bold;
  font-size: 13px;
  opacity: 1;
  text-align: left;
}



.right-section-content .block-container-proposal {
  border: 1px solid #d5d5d5;
  border-radius: 8px;
  padding-left: 30px;
  padding-right: 30px;
  padding-bottom: 10px;
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  row-gap: 20px;
}

.block-container-proposal:hover{
  cursor: pointer;
  border: 1px solid #959595
}
.block-container-proposal .header {
  display: flex;
  justify-content: space-between;
}
/* .block-container-proposal .header .title {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  font-size: 27px;
  line-height: 30px;
  color: #000000;
} */



.block-container-proposal .header img {
  height: 30px;
}

.status {
  border-radius: 20px;
  height: 25px;
  color: white;
  font-weight: Bold;
  font-size: 15px;
}
.active {
  background: rgba(80,200,120,1);
}
.complete {
  background: rgba(114,114,114,1);
}

span.broadcast {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  font-size: 17px;
  line-height: 20px;
  color: #595959;
}

span.description {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 16px;
  color: #000000;
}

span.valid-till {
  display: flex;
  font-size: 17px;
  line-height: 20px;
}

span.valid-till img {
  height: 25px;
  margin-right: 5px;
}
span.cheak {
  display: flex;
  align-items: center;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  font-size: 18px;
  line-height: 20px;
  color: #595959;
  border-top: 1px solid #d5d5d5;
  margin-left: -30px;
    margin-right: -30px;
    padding: 10px 30px 0px 30px;
}

span.cheak img {
  height: 30px;
  margin-right: 5px;
}

.right-section-no-content {
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  row-gap: 30px;
  width: 100%;
  padding: 30px 50px;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 20px;
  color: #959595;
  /* min-height: 500px; */
}
.right-section-no-content > img{
  height: 200px;
}
</style>