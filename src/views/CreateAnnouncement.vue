<template>
    <div v-if = "loading"  style="width: 90%; height: 85%; display: flex; justify-content: center; vertical-align: middle; position: fixed; align-items: center; text-align: center;">

  <div>
    <img src="../assets/loader.gif" alt="this slowpoke moves"  width="150" />
  </div>
  </div>
    <div v-else style="padding-left: 35px; margin-left: 100px;">
        <button type=" " class="btn btn-default mt-5 p-0" @click="backToAnnounce"><b>&#8592; Back</b></button>
        <p class="my-5  fw-bolder fs-1 text-dark">Broadcast announcement</p>
        <form v-on:submit.prevent="validateAnnouncement" class="row mt-4 mb-5" style="width: 100%;">
        
            <div class="col-md-7">
                <div class="lisi-item my-1">
                    <img src="../assets/check.png" style="height: 20px;" />
                    <span class="fw-bolder" style="font-size: 15px">The broadcasted announcement will be store on Web3.storage</span>
                </div>
                <div class="lisi-item my-1">
                    <img src="../assets/check.png" />
                    <span class="fw-bolder">Pinata will perform additional pinning</span>
                </div>
                <div class="lisi-item my-1">
                    <img src="../assets/check.png" />
                    <span class="fw-bolder">
                    You can delete the announcement after it was broadcasted. However, it will just be invisibile
                in the announcement list. For actual deletion, you need to delete it from Web3.storage and also
                unpin the CID at Pinata.
                    </span>
                </div>
                <div class="lisi-item my-1">
                    <img src="../assets/check.png" />
                    <span class="fw-bolder">Please note that if there are nodes on IPFS network still saving a copy of your announcement,
                        you can’t really permenantly delete it.</span>
                </div>


                





                <div class="mb-4 mt-4">
                    <label for="title" class="form-label fw-bolder fs-6">Title of announcement</label>
                    <input  v-model="announce.title" 
                            v-bind:class="{ 'is-valid': validation.valid.title, 'is-invalid': validation.invalid.title }" 
                            v-on:focus="clearValidation('title')" 
                            type="text" id="title" class="form-control" autocomplete="false">
                    <div class="valid-feedback" v-if="validation.valid.title">{{ validation.valid.title }}</div>
                    <div class="invalid-feedback" v-if="validation.invalid.title">{{ validation.invalid.title }}</div>
                </div>
                <div class="mb-4 mt-2">
                    <label for="summary" class="form-label fw-bolder fs-6">Summary</label>
                    <textarea   v-model="announce.summary" 
                                v-bind:class="{ 'is-valid': validation.valid.summary, 'is-invalid': validation.invalid.summary }" 
                                v-on:focus="clearValidation('summary')" 
                                class="form-control" rows="10" autocomplete="false"></textarea>
                    <div class="valid-feedback" v-if="validation.valid.summary">{{ validation.valid.summary }}</div>
                    <div class="invalid-feedback" v-if="validation.invalid.summary">{{ validation.invalid.summary }}</div>
                </div>
                <div class="mb-4 mt-2">
                    <label for="attachment_link" class="form-label fw-bolder fs-6">Attachment link</label>
                    <input v-model="announce.attachment" type="text" class="form-control"  placeholder="Eg. wwww.example.com">
                </div>
                <div class="mb-4 mt-2">
                    <label for="attachment_link" class="form-label fw-bolder fs-6">Valid till</label>
                    <div class="input-group "
                        :class="{ 'is-valid': validation.valid.date, 'superwarden-invalid': validation.invalid.date }"
                    >
                    <div style = "width: 92.5%">
                    
                        <Datepicker v-model="announce.date" 
                                    v-on:focus="clearValidation('date')"
                        class="form-control border-end-0 superwarden-right-border" placeholder="choose a date" style="width: 100%;"/>
                    </div>
                        <span class="input-group-text"><img src="../assets/calendar.png" style="height: 22px" /></span>
                    </div>
                    <div class="invalid-feedback" v-if="validation.invalid.date" style="display: flex;">{{ validation.invalid.date }}</div>
                </div>
                <div class="mb-4 mt-2">
                    <label for="time-zone" class="form-label fw-bolder fs-6">Timezone</label>
                    <select v-model = "announce.timezone" 
                            v-bind:class="{ 'is-valid': validation.valid.timezone, 'is-invalid': validation.invalid.timezone }" 
                            v-on:focus="clearValidation('timezone')"
                            class="form-select">
                        <option value="" selected disabled>Choose your timezone</option>
                        <option :value="t" v-for = "(t) in timezoneList" :label = "t.label"></option>
                    </select>
                    <div class="valid-feedback" v-if="validation.valid.timezone">{{ validation.valid.timezone }}</div>
                    <div class="invalid-feedback" v-if="validation.invalid.timezone">{{ validation.invalid.timezone }}</div>
                </div>
                <p class="fw-bolder fs-6 mb-1">Important announcement</p>
                <span class="" style="font-weight: 700;font-size: 14px;color: #959595;">If check, the announcement will be marked with a red star</span>
                <div class="form-check form-switch mt-2">
                    <input v-model="announce.importance" style="height: 32px; width: 65px" class="form-check-input" type="checkbox">
                </div>
                <button type="submit" class="btn btn-danger float-end my-5 px-4">Broadcast</button>
            </div>
            
        </form>

      
    </div>




    
</template>
<script>

// import api from './api'
import timezones from 'compact-timezone-list';
import Datepicker from "vue3-datepicker";
import { Web3Storage } from "web3.storage";
import pinataSDK from '@pinata/sdk';


export default {
    name: "CreateAnnouncement",
    components: { Datepicker},

    data() {
        return {
            slug : this.$route.params['slug'],
            timezoneList: timezones,
            date: '',
            announce: {},
            townhall: {},
                        validation: { 
                invalid: {},
                valid: {},},
            loading: false


        }
    },
    computed: {

    },

    created() {
        this.getTownhallData()

    },
    mounted() {
        
    },
    methods: {
        backToAnnounce(){this.$router.push(`/${this.slug}/announcement`)},
        validateAnnouncement(){
            if (!this.announce.title) {
                this.validation.invalid.title = 'Please type your title of proposal.';
                return
            } else {
                this.validation.valid.title = 'The tile of proposal is OK.';
            }
            if (!this.announce.summary) {
                this.validation.invalid.summary = 'Please type your summary of proposal.';
                return
            } else {
                this.validation.valid.summary = 'The tile of summary is OK.';
            }
            if (!this.announce.date) {
                this.validation.invalid.date = 'Please type your expire date of proposal.';
                console.log(this.validation.invalid.date )
                return
            } else {
                this.validation.valid.date = 'The date is OK.';
            }
            if (!this.announce.timezone) {
                this.validation.invalid.timezone = 'Please select your timezone.';
                console.log(this.validation.invalid.timezone )
                return
            } else {
                this.validation.valid.timezone = 'The timezone is selected.';
            }
            this.createBroadcast();

        },
        getTownhallData(){
            api.getTownhallData({slug: this.slug}, (res => {
                
            if (res.data.townhall){
                this.townhall = res.data.townhall
            } else {

            }
            }), err =>{
                console.log(err)
            })
      },
       async createBroadcast(){
        this.loading = true
        if (this.townhall.details.webThrKey){
            var client = new Web3Storage({ token: this.townhall.details.webThrKey});
            const blob = new Blob([JSON.stringify(this.announce)], { type: 'application/json' })
            const ee = [new File([blob], 'superwarden.json')];
            const rootCid = await client.put(ee, {maxRetries: 3});
            // let rootCid = 'afefe'
            if (rootCid){
                this.$toast.success(`Uploaded on Web3.Storage.`);
                if (this.townhall.details.pinataKey != '' && this.townhall.details.pinataSecret != ''){
                    const pinata = pinataSDK(this.townhall.details.pinataKey, this.townhall.details.pinataSecret);
                    const options = {
                        pinataMetadata: {
                            name: 'superwarden',
                        },
                    };
                    pinata.pinByHash(rootCid, options).then((result) => {
                            this.$toast.success(`Pinned on Pinata.`);
                        }).catch((err) => {
                            this.$toast.error(`failed to pinata upload`);
                        })
                } else {
                    this.$toast.error(`please reset your pinata settings`);
                }

                api.createBroadcast({slug: this.slug, announce: this.announce, creator: this.$store.getters._id, cid: rootCid}, (res => {
                    console.log(res.data)
                    this.loading = false
                    if (res.data.announce.title){
                        this.$toast.success(`Announcement broadcast successfully.`);
                        this.$router.push(`/${this.slug}/announcement`)
                    } else {
                        this.$toast.error(`fail to connect to the server.`);
                    }
                }), err =>{
                    console.log(err)
                })
            } else {
                this.$toast.error(`fail to ipfs upload\n please check your web3.storage api key`);
            }
        } else {
            this.$toast.error(`fail to ipfs upload\n please set your web3.storage api key to your townhall.`);
        }




            
        },
                clearValidation: function(field) {
            this.validation.valid[field] = '';
            this.validation.invalid[field] = '';
        }

    }
}
</script>
<style>
.lisi-item {
  display: flex;
  column-gap: 5px;
}

.lisi-item>img {
  height: 20px;
}
.lisi-item>span {
  font-size: 15px;
}

</style>