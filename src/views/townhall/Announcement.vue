<template>
<div v-if = "loading"  style="width: 70%; height: 85%; display: flex; justify-content: center; vertical-align: middle; position: fixed; align-items: center; text-align: center;">

  <div>
    <img src="../../assets/loader.gif" alt="this slowpoke moves"  width="150" />
  </div>
</div>
<div v-else>
  <nav class="navbar navbar-expand-sm h-[65px]" style="border-bottom: 1px solid #d5d5d5">
    <div class="container-fluid">
      <label class="navbar-brand ps-5 pe-4 fs-5 fw-bolder" style="border-right: 2px solid #959595;">Announcement</label>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mynavbar">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="mynavbar">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <label @click = "getAnnouncementList('all')" :class="index === 'all'?  'selected': ''" class="nav-link superwarden-nav" style="background-color: #fff">All</label>
          </li>
          <li class="nav-item">
            <label @click = "getAnnouncementList('open')" :class="index === 'open'?  'selected': ''" class="nav-link superwarden-nav"  style="background-color: #fff">Open</label>
          </li>
          <li class="nav-item">
            <label @click = "getAnnouncementList('important')" :class="index === 'important'?  'selected': ''" class="nav-link superwarden-nav" style="background-color: #fff">Important</label>
          </li>
          <li class="nav-item">
            <label @click = "getAnnouncementList('closed')" :class="index === 'closed'?  'selected': ''" class="nav-link superwarden-nav" style="background-color: #fff">Closed</label>
          </li>
        </ul>
        <form class="d-flex me-4" v-if = "$store.getters.role < 2">
          <button @click="goCreateAnnouncement" class="right-button px-3"  type="button">+Announcement</button>
        </form>
      </div>
    </div>
  </nav>
  
    <div v-if = "announcements.length > 0" class="right-section-content">
      <div @click="goAnnounceDetail(i._id)"  class="block-container-announcement" v-for = "(i) in announcements">
        <div class="my-2" style="display: flex;   justify-content: space-between;">
          <div style="display: flex; ">
            <p class="fw-bolder text-dark px-0 m-0 py-2" style="font-size: 22px;">{{trimmedAnnounceTitle(i.title)}}</p>
            <img v-if = "i.importance"   style="height: 35px;"   class="ms-2"    src="../../assets/staricon.png" />
          </div>
          <div class="my-2 " style="float: right;">
            <p v-if = "!i.passed" class="status active px-3">open</p>
            <p v-else class="status complete px-3">closed</p>
          </div>
        </div>
            <span class="fw-bolder">Broadcast by {{i.creator.name ? trimmedAccountNameAndLowercase(i.creator.name) +"." + i.slug: trimmedAccountAddress(i.creator.address) }}</span>
            <span class="text-dark" style="height: 100px">{{trimmedAnnounceSummary(i.summary)}}</span>
            <span class="valid-till"><img src="../../assets/clock-icon.png"/>Valid Till &nbsp;<img src="../../assets/line1.png" style="height: 20px;"/> {{getDateString(i.expire_at)}} ({{'UTC ' + i.timezone.offset}})</span>
      </div>
    </div>
    <div v-else class="right-section-no-content" :style="`min-height: ${height}px`">
      <img src="../../assets/townhall-quiet.png" />
      <span>There are no announcements currently. Let’s wait for someone to broadcast. </span>
    </div>
          

</div>
           

    
</template>
<script>
import moment from 'moment';

export default {
    name: "Proposal",
    data() {
        return {
          slug : this.$route.params['slug'],
          index: '',
          date: '',
          announcements: [],
          height: innerHeight - 210,
          loading : true,


        }
    },
    computed: {
      role(){return this.$parent.$parent.role},

    },

    created() {
      console.log(this.$store.getters.role)
      this.index = 'all'; 
      this.$parent.$parent.tag = 'a'
      this.getAnnouncementList('all')

    },
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
        trimmedAnnounceTitle(title){
          if (title.length > 38)
              return title.slice(0, 40) + "..." 
            else
              return title
        },
        trimmedAnnounceSummary(summary){
          // console.log(summary.length)
          if (summary.length > 334)
              return summary.slice(0, 334) + "..." 
            else
              return summary
        },
        goAnnounceDetail(_id){this.$router.push(`/announcement/detail/${_id}`)},
        getDateString(string){
          const monthNames = ["January", "February", "March", "April", "May", "June",
              "July", "August", "September", "October", "November", "December"];
          let t = new Date(string)
          const date = ('0' + t.getDate()).slice(-2);
          const month = monthNames[t.getMonth()]
          const year = t.getFullYear();
          return `${date} ${month} ${year}`;
        },
      goCreateAnnouncement(){this.$router.push(`/announcement/create/${this.slug}`)},
      getAnnouncementList(index){
        this.index = index;
        this.loading = true
        api.getAnnouncementList({slug: this.slug, index: this.index}, (res => {
          this.announcements = res.data.list
          this.announcements.map((i, index) => {
              // var userTime = new Date(i.expire_at);
              let userTime = moment(i.expire_at).utcOffset(i.timezone.offset).endOf('day')
              let userTimeOffset = moment().utcOffset(i.timezone.offset).utcOffset() * 60 * 1000
              let userTimeValue = userTime - userTimeOffset
              let now = new Date()
              // let a = moment(now).utcOffset(i.timezone.offset).toString()
              // console.log(a)
              let localTimeOffset = now.getTimezoneOffset() * 60 * 1000;
              let localTimeValue = now.getTime() + localTimeOffset
              // console.log(localTimeOffset)
              if (userTimeValue > localTimeValue){
                  i.passed = false;
              }
              else{
                  i.passed = true
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
  /* background: #FFFDFD; */
  /* width: 50px; */
  margin: 5px;
  width: 100px;
  border-radius: 5px;
  font-size: 15px;
  border: none;
  font-weight: 900;
  /* padding: 5px 20px; */
  /* cursor: pointer; */
}

.selected {
  border: 1px solid #595959 !important;
}
.right-section>.head .options button.none {
  cursor: default;
}

.right-section .head .right-button-holder {
  display: flex;
  flex-grow: 1;
  justify-content: flex-end;
}
.right-button{
   background: rgba(220, 6, 43, 1) !important;
     border-radius: 25px;
       padding: 5px 10px;
         color: white;
         font-size: 13px;
         font-weight: 900;
}

.right-section-content {
  display: flex;
  flex-direction: column;
  row-gap: 30px;
  width: 100%;
  padding: 30px 50px;
}

.right-section-content .block-container-announcement {
  border: 1px solid #d5d5d5;
  border-radius: 8px;
  padding-left: 30px;
  padding-right: 30px;
  padding-bottom: 30px;
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  row-gap: 20px;
}
.block-container-announcement .header {
  display: flex;
  justify-content: space-between;
}

.block-container-announcement .header .title {
  /* line-height: 1px; */
}

.block-container-announcement:hover{
  cursor: pointer;
  border: 1px solid #959595
}
.block-container-announcement .header img {
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
}
.right-section-no-content > img{
  height: 200px;
}


























</style>