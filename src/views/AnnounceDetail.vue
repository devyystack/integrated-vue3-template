<template>
<div v-if = "loading"  style="width: 90%; height: 85%; display: flex; justify-content: center; vertical-align: middle; position: fixed; align-items: center; text-align: center;">

  <div>
    <img src="../assets/loader.gif" alt="this slowpoke moves"  width="150" />
  </div>
</div>
    <div v-else class="ms-5 ps-3 py-5">
        <div class="row" style= "width: 100%;">
            <div class="col-md-10">
                <button @click="backToAnnounceList" class="btn btn-default  p-0" ><b>&#8592; Back</b></button>
                <button v-if = "$store.getters.role < 2" @click="deleteModal = true"   class="btn btn-default p-0 float-end" ><img src="../assets/delete-icon.png" style="height: 22px;"/></button>

                <div class="px-5 mt-5">
                    <div class="block-container-announcement-detail">
                        <div class="header mt-3">
                            <h2 class="fw-bolder text-dark">{{announce.title}}
                            </h2>
                                <img v-if = "announce.importance"   style="height: 35px;"   class="mb-1"    src="../assets/staricon.png" />
                        </div>
                        <span class="fw-bolder mt-2">Broadcast by {{announce.creator.name ? trimmedAccountNameAndLowercase(announce.creator.name) +"." + announce.slug: trimmedAccountAddress(announce.creator.address) }}
                            <span   v-if="announce.passed" class="status-complete ms-2">closed</span>
                            <span v-else class="status-active ms-2">open</span>
                        </span>
                        <span class="valid-till fw-bolder mt-2"><img src="../assets/clock-icon.png" class="pb-1 me-2" style="height: 25px;"/>Valid Till &nbsp;<img src="../assets/line1.png" style="height: 20px;"/> {{getDateString(announce.expire_at)}} ({{'UTC ' + announce.timezone.offset}})</span>
                    </div>
                    <div class="mt-4">
                        <p class="fs-5 fw-bolder text-dark">Summary</p>
                        <p>{{announce.summary}}</p>
                    </div>
                    <div class="mt-4">
                        <p class="fs-5 fw-bolder text-dark">Attachment link</p>
                        <p style="display: flex;"><img  src="../assets/file-icon.png" style="height: 24px; display: flex;"/><a :href="`https://${announce.attachment}`" class="ms-2 text-dark" style="color: #595959; text-decoration: none;">{{announce.attachment}}</a></p>
                        <div class="file-details mb-5">
                            <span>web3.storage CID</span>
                            <span>{{announce.cid}}</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>

    </div>

<Modal v-model="deleteModal" :close="closeDeleteModal" style="z-index: 9999;">
    <div class="modal-dialog" style="min-width: 600px;">
        <div class="modal-content">
            <div @click="closeDeleteModal">
                <button style="right: 15px; position: absolute;" type="button" class="close border-0 mt-2 fs-4" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body mx-5 px-3 py-4">
                <p class="modal-title mt-4 text-center text-dark fw-bolder" style="font-size: 25px;"><span style="color: #dc062b;">Danger!</span> Are you really sure?</p>
                <p class = "mt-3">The deletion action <span class="fw-bolder">CANNOT</span> be undone. This will remove the announcement from the townhall and no longer able to view or even vote it. If your proposal is in an active voting status, deletion may also cause the voting records and result fail to store in the IPFS storage tools. Only delete proposals that are wrongly created or confirm to be deleted.  </p>
                <form   v-on:submit.prevent="validateDeleteModal" class="my-3 p-2 text-center">
                    <div class="mb-4 mt-2">
                        <label for="title" class="form-label fs-6">Please type in “confirm” to confirm your deletion.</label>
                        <input  v-model = "deleteConfirm"
                                v-bind:class="{ 'is-valid': validation.valid.deleteConfirm, 'is-invalid': validation.invalid.deleteConfirm }" 
                                v-on:focus="clearValidation('deleteConfirm')" 
                                type="text" id="title" class="form-control" autocomplete="false">
                        <div class="valid-feedback" v-if="validation.valid.deleteConfirm">{{ validation.valid.deleteConfirm }}</div>
                        <div class="invalid-feedback" v-if="validation.invalid.deleteConfirm">{{ validation.invalid.deleteConfirm }}</div>
                    </div>
                    <button class="btn btn-danger my-4"  type="submit" style="width: 100%;">I understand the consequences.<br/>Delete this announcement.</button>
                </form>
            </div>
        </div>
    </div>
  </Modal>


</template>
<script>

// import api from './api'
import moment from 'moment';

export default {
    name: "AnnounceDetail",
    data() {
        return {
            idx: this.$route.params['id'],
            deleteModal: false,
            deleteConfirm: '',
            validation: { 
                invalid: {},
                valid: {},},
            announce: {
                title: '',
                passed: false,
                creator: {
                    name: '',
                    address: ''
                },
                timezone: {
                    offset: ''
                }
            },
            loading: true

            // active: {status : false}

        }
    },
    computed: {

    },

    created() {
        if (this.$store.getters.role == 10)
            this.$router.push(`/`)
        else
            this.getAnnounceDate()
    },
    mounted() {
        
    },
    methods: {
        closeDeleteModal(){ this.deleteModal = false
            this.deleteConfirm = ''
            this.clearValidation('deleteConfirm')
        },
        validateDeleteModal(){
            if (this.deleteConfirm != "confirm"){
                this.validation.invalid.deleteConfirm = 'Please fill out this input correctly.';
                return
            }
            api.deleteAnnouncement({_id:this.announce._id}, (res => {
                if (res){
                    this.deleteModal = false
                    this.$toast.success('You deleted the announcement.')
                    this.backToAnnounceList()
                }
                    
                }), err =>{
                    console.log(err)
                })
                
        },
        clearValidation: function(field) {
            this.validation.valid[field] = '';
            this.validation.invalid[field] = '';
        },
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
            // console.log(title.length)
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
        getDateString(string){
          const monthNames = ["January", "February", "March", "April", "May", "June",
              "July", "August", "September", "October", "November", "December"];
          let t = new Date(string)
          const date = ('0' + t.getDate()).slice(-2);
          // const month = ('0' + (t.getMonth() + 1)).slice(-2);
          const month = monthNames[t.getMonth()]
          const year = t.getFullYear();
          return `${date} ${month} ${year}`;
        },
        backToAnnounceList(){this.$router.push(`/${this.announce.slug}/announcement`)},
        getAnnounceDate(){
            this.loading = true
            api.getAnnounceDate({_id: this.idx}, (res => {
                this.announce = res.data.announce
                console.log(this.announce)
                var userTime = new Date(this.announce.expire_at);
                let userTimeOffset = moment().utcOffset(this.announce.timezone.offset).utcOffset() * 60 * 1000
                let userTimeValue = userTime.getTime() - userTimeOffset
                let now = new Date()
                let localTimeOffset = now.getTimezoneOffset() * 60 * 1000;
                let localTimeValue = now.getTime() - localTimeOffset
                if (userTimeValue > localTimeValue){
                    this.announce.passed = false;
                }
                else{
                    this.announce.passed = true
                }
                this.loading = false
                console.log(this.announce)
            }), err =>{
                console.log(err)
            })
        }
    }
}
</script>
<style>
.block-container-announcement-detail {
  display: flex;
  flex-direction: column;
  row-gap: 20px;
}

.block-container-announcement-detail .header {
  display: flex;
  justify-content: space-between;
}

.block-container-announcement-detail .header .status {
  border-radius: 20px;
  height: 25px;
  padding: 2px 15px;
  color: white;
  font-weight: Bold;
  font-size: 15px;
}
.status-active {
  border-radius: 20px;
  color: white;
  padding: 2px 15px;

  background: rgba(80,200,120,1);
}
.status-complete {
  border-radius: 20px;
  color: white;
  padding: 2px 15px;

  background: rgba(114,114,114,1);
}
.file-details{
  height: 55px;
  border: 1px solid #959595;
  border-radius: 5px;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 50px;
  color: #959595;
  /* font-size: 20px; */
}
</style>