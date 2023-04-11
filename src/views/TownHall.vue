<template>
<div v-if="loading"
      style="position: fixed; display: flex; justify-content: center; vertical-align: middle; align-items: center; text-align: center; border-right: 1px solid #d5d5d5; height: 100%; z-index: 50; background-color: #ffffff;"
      class="lg:w-1/4 float-left hidden lg:block p-0 m-0 overflow-hidden"
      id="sidebar-left"
    >
  <!-- <fade-loader class="" :loading="loading" color="#000" height="10px" width="10px"></fade-loader> -->
  <pulse-loader :loading="loading" color="#595959" size="12px" class="mb-5"></pulse-loader>

    </div>

<div v-else
      style="position: fixed; border-right: 1px solid #d5d5d5; height: 100%; z-index: 50; background-color: #ffffff;"
      class="lg:w-1/4 float-left hidden lg:block p-0 m-0 overflow-hidden"
      id="sidebar-left"
    >
                  <img v-if = "townhall.details.coverPhoto == ''" src="../assets/card-cover-photo.png" style="width: 100%; height: 150px" />
              <img v-else :src="townhall.details.coverPhoto" style="width: 100%; height: 150px" />
                            <div class="text-center item-center justify-center items-center " style="display: flex;">
                <img :src="townhall.details.avatar" class="text-center "  style="display: flex; margin-top: -40px; background-color: #ffffff; width: 75px; border-radius: 50%; border: 2px solid #ffffff;"/>
              </div>
              <p class="text-center fw-bolder fs-5 text-dark my-2">{{townhall.details.name}}</p>
              <p class="text-center fw-bolder">{{townhall.villagers.length}} Villagers</p>
              <div class="text-center">
                <button v-if = "role < 10" class="join-button"><span>Joined</span></button>
                <button v-else class="join-button"><span>Join</span></button>
              </div>
                <div class="links my-4" :style="`left: ${width / 4}px`">
                  <div class="icons">
                    <a :href="townhall.details.twitter"><img src="../assets/twiter-icon.png"></a>
                    <a :href="townhall.details.discord"><img src="../assets/game-icon.png"></a>  
                    <a :href="townhall.details.github"><img src="../assets//github-icon.png"></a>  
                    <a :href="townhall.details.forum"><img src="../assets/browser-icon.png"></a>  
                  </div>
                </div>
              <div class="" style="margin-left:20px">
    
                <p @click="clickProposal" :class="tag == 'p'? 'navbar-active' : ''" class=" ps-3 py-2 mb-0 fw-bolder" style="cursor: pointer;">Proposals</p>
                <p @click="clickAnnouncement" :class="tag == 'a'? 'navbar-active' : ''" class=" py-2 ps-3 mb-0 fw-bolder" style="cursor: pointer;">Announcements</p>
                <p @click="clickDetails" :class="tag == 'd'? 'navbar-active' : ''" class="  ps-3 py-2 mb-0 fw-bolder" style="cursor: pointer;">Details</p>
                <div v-if = "role > 1" style="display: flex;" class="py-2">

                <p   class="fw-bolder ps-3 " style="color: #959595;">Settings </p>
                <span><img class="ps-2" src="../assets/lock.png" style="height: 20px;"/></span>

                </div>
                <p v-else @click="clickSetting" :class="tag == 's'? 'navbar-active' : ''" class="ps-3 py-2 mb-0 fw-bolder" style="cursor: pointer;">Settings</p>

    
              </div>
    </div>
        <div
      class="w-full lg:w-3/4 float-right relative right-section"
      id="content-right">
          <router-view />

      </div>

</template>
<script>
import BaseContainer from '../components/BaseContainer.vue'
import FadeLoader from 'vue-spinner/src/FadeLoader.vue';
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'

export default {
    name: "TownHall",
    components: {BaseContainer, FadeLoader, PulseLoader},

    data() {
        return {
          slug : this.$route.params['slug'],
          role: 10, 
          townhall: {
            villagers: [],
            details: {}
          },
          tag: 'p',
          height: 300,
          loading: true,
          // width: innerWidth - 200
        }
    },
    computed: {
// height(){
//         return  window.innerHeight - 300
//       }

    },
    created() {
      // this.height = window.innerHeight - 300
      console.log('this.height')

      console.log(innerHeight-300)
      this.getTownhallData()},
    // mounted() {},
    methods: {
      
      getTownhallData(){
        this.loading = true
        api.getTownhallData({slug: this.slug}, (async (res) => {
          this.height = window.innerHeight - 80
          if (res.data.townhall){
            console.log('hello townhall')
            this.townhall = res.data.townhall
            if (this.townhall.superwarden == this.$store.getters._addr){

              this.role = 0// superwarden
            } else if (this.townhall.details.warden.includes(this.$store.getters.name) || this.townhall.details.warden.includes(this.$store.getters._addr)){
              this.role = 1// warden
            } else if (this.townhall.details.master.includes(this.$store.getters.name) || this.townhall.details.master.includes(this.$store.getters._addr)){
              this.role = 2// master
            } else {
              if (this.townhall.details.threshold.status || this.townhall.details.tcr.status){
                let proposability = false
                if (this.townhall.details.threshold.tk_addr){
                  var contract = await tronWeb.contract().at(this.townhall.details.threshold.tk_addr)
                  var my_balance = await contract.methods.balanceOf(window.tronWeb.defaultAddress.base58).call();
                  let balance = parseInt(my_balance.toString())
                  if (balance > parseInt(this.townhall.details.threshold.threshold)){
                    proposability = true 
                  }
                }
                if (this.townhall.details.tcr.tk_addr){
                  var contract = await tronWeb.contract().at(this.townhall.details.tcr.tk_addr)
                  var my_balance = await contract.methods.balanceOf(window.tronWeb.defaultAddress.base58).call();
                  let balance = parseInt(my_balance.toString())
                  if (balance > 0){
                    proposability = true
                  }
                }
                if (proposability)
                  this.role = 3 // villager but create proposal
                else
                  this.role = 4 // just villager
              } else {
                this.role = 4
              }
            }
            if (this.role == 10) // over lookers
              this.role = 5

            this.$store.dispatch('account/setRole', this.role)
            this.loading = false
                // this.$store.dispatch('account/setAccount')
            // console.log(this.$store)

          } else {
            this.$toast.error("DB or Server Error")

          }
        }), err =>{
            console.log(err)
        })
      },
      clickProposal(){ this.tag = 'p'; this.$router.push(`/${this.slug}/proposal`)},
      clickAnnouncement(){  this.tag = 'a';this.$router.push(`/${this.slug}/announcement`)},
      clickDetails(){this.tag = 'd'; this.$router.push(`/${this.slug}/details`)},
      clickSetting(){this.tag = 's'; this.$router.push(`/setting/${this.slug}`)},
    }
}
</script>
<style>
.content {
  width: 100%;
  display: flex;
  max-width: 2000px;
  margin: 0px auto;
  align-items: stretch;
}

.left-section {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 0px;
  overflow: hidden;
  border-right: 2px solid #D5D5D5;
}

.cover-photo {
  width: 100%;
  height: 200px;
  background: url('../assets/card-cover-photo.png');
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  position: relative;
}

.profile {
  width: 80px;
  height: 80px;
  position: absolute;
  bottom: -40;
  left: 50%;
  transform: translate(-40px);
  border: 3px solid rgba(255, 255, 255, 1);
  border-radius: 50%;
}

.card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  margin-top: 35px;
}

.card-title {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 800;
  font-size: 22px;
  height: 30px;
  color: #000000;
}

.villagers-count {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  color: #595959;
  height: 30px;
}

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

.nav-content div {
  padding: 5px 18px;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  font-size: 23px;
  color: #595959;
  /* border-radius: 5px; */
    cursor: pointer;
}

.nav-content div:hover {
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
}



.right-section>.head .options span.selected {
  border: 2px solid #959595;
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

.right-section-content {
  display: flex;
  flex-direction: column;
  row-gap: 30px;
  width: 100%;
  padding: 30px 50px;
}

.right-section-content .block-container {
  border: 1px solid #959595;
  border-radius: 10px;
  padding: 30px;
  padding-bottom: 10px;
  display: flex;
  flex-direction: column;
  row-gap: 20px;
}

.block-container .header .title {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  font-size: 27px;
  line-height: 30px;
  color: #000000;
}

.block-container .header {
  display: flex;
  justify-content: space-between;
}

.block-container .header img {
  height: 30px;
}

.block-container .header .status {
  border-radius: 20px;
  height: 25px;
  padding: 2px 15px;
  color: white;
  font-family: Inter;
  font-weight: Bold;
  font-size: 15px;
}
.block-container .header .active {
  background: rgba(80,200,120,1);
}
.block-container .header .complete {
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
  align-items: center;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  font-size: 18px;
  line-height: 20px;
  color: #595959;
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
  border-top: 1px solid #959595;
  margin-left: -30px;
    margin-right: -30px;
    padding: 10px 30px 0px 30px;
}

span.cheak img {
  height: 30px;
  margin-right: 5px;
}


.links {
  /* position: fixed;
  bottom: 10px; */
  display: flex;
  align-items: flex-end;
  justify-content: center;
  /* padding-right: 15px;
  margin-top: 1vh; */
  /* padding: 15px; */
  /* border-right: 2px solid #D5D5D5; */
}

.links .icons {
  display: flex;
  column-gap: 10px;
}

.links .icons img{
  height: 20px;
}
.navbar-active {
    background-color:#EEEEEE;
}
</style>