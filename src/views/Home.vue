<template>
  <div v-if = "loading" style="width: 100%; height: 100%; display: flex; justify-content: center; vertical-align: middle; position: fixed; align-items: center; text-align: center;">
    <img src="../assets/loader.gif" alt="this slowpoke moves"  width="150" class="mb-5 me-5" />
  </div>
  <div v-else style="padding-top: 32px;
    padding-left: 75px;
    padding-right: 73px; ">
    <div class="text-center">
      <img src="../assets/discord.png" style="width: 100%; height: 350px; border-radius: 8px;" />
      <div  style="margin-top: -32%; width:42%; display: inline-block; vertical-align: middle;">
        <label class="mb-3" style=" font-size: 2vw; color: #FFFFFF; font-weight: 700;">Explore the Superwarden World</label>
        <div class="input-group mb-3" style="background-color: #FFFFFF; border-radius: 8px;">
            <input  v-model = "searchPattern.name" style="width: 45%;" type="text" class="form-control border-0" placeholder="Search your townhall...">
            <span @click="search" class="input-group-text border-0"><img src="../assets/search-icon.png" style="height: 22px; cursor: pointer;" /></span>
            <span style="display: flex; justify-content: center; align-items: center;"><img src="../assets/line.png" style="height: 30px" /></span>
            <span class="input-group-text border-0"><img src="../assets/boxicon.png" style="height: 22px" /></span>
            
            <select class="form-select border-0  overflow-hidden" v-model="searchPattern.type" @change="search">
              <option selected value = "all">All...</option>
              <option :value= "i" v-for = "(i) in categories">{{i}}</option>
            </select>
          </div>
      </div>
    </div>
    <div class="row mb-5" v-if = "townhalls.length > 0">
      <p style="font-size: 2vw; font-weight: 900;" class="my-3">Townhalls</p>
      <div class="col-md-3 mb-4" v-for="(t, i) in townhalls">
        <div  class="superwarden-card" >
          <img v-if = "t.details.coverPhoto == ''" class="top-radius" src="../assets/card-cover-photo.png" style="width: 100%; height: 150px" />
          <img v-else :src="t.details.coverPhoto" class="top-radius" style="width: 100%; height: 150px" />
  
          <div style="border-radius: 3px; ">
            <img class="" :src="t.details.avatar" style="display: inline-table; background-color: #ffffff; width: 70px; margin-top: -35px; margin-left: 20px; border-radius: 50%; border: 2px solid #ffffff;"  />
            <div class="px-3" style="">
              <div class="mb-3"  style="height: 95px;">
                <label class="my-2" style="color: #000000; font-weight: bolder; font-size: 16px;">{{trimmedTownhallName(t.details.name)}}</label>
                <p style="font-size: 13px;">{{trimmedTownhallBio(t.details.bio)}}</p>
              </div>
              <label class="mt-4 mb-1" style="font-size: 15px; font-weight: bolder;">{{t.villagers.length}} villagers</label>
            </div>
            <div class="my-3 text-center px-3" >
              <button v-if = "t.mine" class="join-button" @click = "viewTownhall(t.details.slug)" style="width: 100%;">Joined</button>
              <button v-else class="join-button" @click = "viewJoiningTownhall(t)" style="width: 100%;">Join</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-center">
      <p class="fw-bolder fs-4 mt-3">Still there is no townhall. You would be first.</p>
    </div>

  </div>




  <Modal v-model="joinModalShow" :close="closeModal" style="z-index: 9999;">
  <div class="modal-dialog modal-lg">
      <div class="modal-content " style="min-width: 850px;">
        <div @click="joinModalShow = false">
          <button style="right: 15px; position: absolute;" type="button" class="close border-0 mt-2 fs-4">
              <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class = "row p-0 m-0">
          <div class="col-md-5 p-0" style="border-right: 1px solid #d5d5d5;">
            
              <img :src = "joiningTownhall.details.coverPhoto" style="width: 100%; border-top-right-radius: 0px;" class="top-radius" />
              <div class="ms-5 me-1">
                  <img class="" :src="joiningTownhall.details.avatar" style="display: inline-table; width: 80px; margin-top: -35px; margin-left: -5px; border-radius: 50%; border: 2px solid #ffffff;"  />
                  <div>
                    <label class="mt-2 fw-bolder">{{joiningTownhall.villagers.length}} Villagers</label>
                  </div>
                  <div class="me-4">
                    <label class="mt-2 text-dark popup-content-text">
                      {{joiningTownhall.details.bio}}
                    </label>
                  </div>
              </div>
          </div>
          <div class="col-md-7 px-5">
            <div class = "mt-5 mb-5 ">
              <div class="text-center">
                <label class="fw-bolder mb-0 pb-0">Become the villager of</label>
              </div>
              <div class="text-center">
                <label class=" text-center fw-bolder fs-4 text-dark">{{trimmedTownhallName(joiningTownhall.details.name)}}</label>
              </div>
              <div class="my-4" style="display: flex; justify-content: center; align-items: center;">
                  <img class="text-center" src="../assets/villager.png" style="width: 75%; " />
              </div>
              <div class="mb-1">
                <label class="form-label popup-content-text fw-bolder">What you can do here?</label>
              </div>
              <div style="display: flex; justify-content: center; align-items: center; " >
                  <p class="ps-2 pt-2 pb-2 popup-content-bold-text popup-content-text-border" style="width: 100%; display: flex; border-radius: 7px;">
                   <img class = "me-2"  src="../assets/check.png" style="width: 25px; "/>
                   You can vote proposals with community token
                  </p>
              </div>
              <div style="display: flex; justify-content: center; align-items: center;" >
                  <p class="ps-2 pt-2 pb-2 popup-content-bold-text popup-content-text-border" style="width: 100%; display: flex;  border-radius: 7px; ">
                   <img class = "me-2" src="../assets/check.png" style="width: 25px; height: 25px;"/>
                   Have the chance to become a warden or master
                  </p>
              </div>
              <div style="display: flex; justify-content: center; align-items: center; " >
                  <p class="ps-2 pt-2 pb-2 popup-content-bold-text popup-content-text-border" style="width: 100%; display: flex; border-radius: 7px;">
                   <img class = "me-2"  src="../assets/check.png" style="width: 25px; "/>
                   Stay alert to townhall activities
                  </p>
              </div>
              <button @click="joinTownhall" type="button" class="btn btn-danger text-center px-5 mt-2 mb-4" style="float: right;">Join</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>
<script>

// import api from './api'

export default {
    name: "Home",
    data() {
        return {
          searchPattern: {
            name: '',
            type: ''
          },
          joinModalShow: false,
          joiningTownhall: {
            details: {}
          },
          townhalls: [],
					categories : [ 'Media', 'Social', 'Entertainment', 'Protocol', 'Investment', 'Collectors', 'Grant', 'Art and Culture','Education', 'Research', 'Creator', 'Service'],
          loader: '',
          loading: true,
        }
    },
    computed: {},
    beforeCreate(){this.$parent.$parent.tabs.push(this);},
    created(){this.getTownhallList();},
    methods: {

      trimmedTownhallName(name){
        if (name.length > 20)
            return name.slice(0, 15) + "..." + name.slice(name.length - 4, name.length)
        else
          return name
      },

      trimmedTownhallBio(bio){
        if (bio.length > 95)
          return bio.slice(0, 95) + "..."
        else
          return bio
      },

      search(){this.getTownhallList()},

      closeModal() {this.joinModalShow = false;},

      joinTownhall(){
        api.joinTownhall({_id: this.joiningTownhall._id, villager: this.$store.getters._id}, ( async (res) => {
          if (res){
            await this.$parent.$parent.getAccountData()
            await this.getTownhallList()
            this.joinModalShow = false
            this.$toast.success(`You Joined ${res.data.townhall.details.slug}`)
            // this.joiningTownhall = {}
          }
        }), err =>{
            console.log(err)
        })

      },
      viewJoiningTownhall(t){
        this.joiningTownhall = t
        this.joinModalShow = true

      },
        viewTownhall(slug){
          this.$router.push(`/${slug}/proposal`)
        },
        getTownhallList(){
          // let loader = this.$loading.show()
          this.loading = true
          api.getTownhallList({search: this.searchPattern}, (res => {
              this.townhalls = res.data.data
              this.townhalls.map((i) =>{
                  for (var j = 0; j < i.villagers.length; j++){
                      if (i.villagers[j]._id == this.$store.getters._id){
                          i.mine = true
                      }
                  }
              })
              // loader.hide()
              this.loading = false
          }), err =>{
              console.log(err)
          })
        }
    }
}
</script>
<style>
.discord {
    height: 350px;
    background: url('../assets/discord.png');
    background-size: cover;
    /* background-size: 100%; */
    background-repeat: no-repeat;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .search-holder {
    float: right;
    width: fit-content;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .search-title {
    /* font-family: 'Inter'; */
    font-style: normal;
    font-weight: 700;
    font-size: 30px;
    line-height: 85px;
    color: #FFFFFF;
  }
  .searchbar {
    width: 100%;
    height: 45px;
    background: white;
    display: flex;
    align-items: center;
    border-radius: 5px;
  }
  .searchbar > input{
    height: 100%;
    border: none;
    margin-right: 10px;
  }
  .searchbar > img{
    margin: 0px 15px;
  }
  .searchbar > span{
    color: #959595;
    margin-right: 35px;
  }
  
  .Townhalls-text {
    /* font-family: 'Inter'; */
    font-style: normal;
    font-weight: 700;
    font-size: 30px;
    line-height: 48px;
    color: #595959;
    margin-bottom: 10px;
    margin-top: 10px;
  }
  
  .Townhalls {
    display: flex;
    flex-wrap: wrap;
    row-gap: 20px;
  }
  
  .Townhalls .card {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    margin: 5px;
    height: 350px;
    border: 1px solid rgba(213, 213, 213, 1);
    border-radius: 8px;
    overflow: hidden;
  }
  
  .card-cover-photo {
    width: 100%;
    height: 150px;
    background: url('../assets/card-cover-photo.png');
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
    opacity: 1;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    position: relative;
  }
  
  .card-avator {
    width: 60px;
    height: 60px;
    position: absolute;
    /* bottom: -30; */
    margin-top: 110px;
    left: 15px;
    border: 3px solid rgba(255, 255, 255, 1);
    border-top-left-radius: 100px;
    border-top-right-radius: 100px;
    border-bottom-left-radius: 100px;
    border-bottom-right-radius: 100px;
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
</style>