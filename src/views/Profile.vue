<template>
    <section class="">
        <section class="content row">
            <div class="col-12 col-lg-5">
                <div class="left-block p-4 mb-4">
                    <div class="head">
                        <span v-if = "account.name" class="title">{{trimmedAccountName(account.name)}}</span>
                        <span v-else class="title">{{trimmedAccountAddress(account.address)}}</span>

                        <div class="coppy" >
                            <span class="ms-2" style="font-size: 15px;">
                                {{trimmedAccountAddress(account.address)}}
                            </span>
                            <div class="superwarden-tooltip me-2">
                                <img src="../assets/coppy-icon.png" style = "cursor: pointer; height: 22px;" @click="myFunction"/>
                                <span class="tooltiptext" id="myTooltip" >Copy to</span>
                            </div>

                        </div>
                    </div>

                    <p v-if = "account.bio" class="description my-4">{{account.bio}}</p>
                    <span v-else = "account.bio" class="description my-4"></span>
                    <button @click = "editProfile" type="button" class="action-button mt-3"><span>Edit Profile</span></button>
                </div>
            </div>
            <div class="col-12 col-lg-7">
                <div class="block-container-profile mb-4">
                    <div class="block-head"><span class="block-title" style="color: #595959;">Joined Townhall</span></div>
                    <div class="block-contect">
                        <div v-for = "(item, k) in townhalls" class="items m-1">
                            <img :src="item.details.avatar">
                        </div>
                    </div>
                </div>
                <div class="block-container-profile mb-4">
                    <div class="block-head"><span class="fw-bolder fw-1" style="color: #595959;">
                            Superwarden of</span>
                    </div>
                    <div v-if = "superwardens.length < 1">
                        <div class="block-contect"><span class="block-title" >not a warden of any
                                townhall.</span>
                        </div>
                    </div>
                    <div v-else v-for = "(item) in superwardens" class="block-contect">
                        <div class="row">
                            <div class="col-12 col-lg-5 col-xl-4 col-xxl-3"><img class="avator"
                                    :src="item.details.avatar" /></div>
                            <div class="col-12 col-lg-7 col-xl-8 col-xxl-9"
                                style="display: flex; flex-direction: column;">
                                <span class="block-title" style="color: black">{{trimmedTownhallName(item.details.name)}}</span>
                                <span class="mt-1 mb-2 villagers">{{item.villagers.length}} Villagers</span>
                                <span class="text-dark">{{trimmedTownhallBio(item.details.bio)}}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="block-container-profile mb-4">
                    <div class="block-head"><span class="block-title" style="color: #595959;">
                            Warden of</span></div>
                    <div v-if = "wardens.length < 1">
                        <div class="block-contect"><span class="block-title" >not a warden of any
                                townhall.</span>
                        </div>
                    </div>
                    <div v-else>
                        <div class="block-contect">
                                                        <div v-for = "(item, k) in wardens" class="items m-1">
                                <img :src="item.details.avatar">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="block-container-profile mb-4">
                    <div class="block-head"><span class="block-title" style="color: #595959;">
                            Master of</span>
                    </div>
                    <div v-if = "masters.length < 1">
                        <div class="block-contect"><span class="block-title">not a master of any
                            townhall.</span>
                        </div>
                    </div>
                    <div v-else>
                        <div class="block-contect">
                            <div v-for = "(item, k) in masters" class="items m-1">
                                <img :src="item.details.avatar">
                            </div>
                            <!-- <div class="items">
                                <img src="../assets/logo-icon.png">
                            </div> -->
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </section>


<!-- Modal Region -->
  <Modal v-model="profileModalShow" :close="closeModal" style="z-index: 9999;">
    <div class="modal-dialog" style="min-width: 600px;">
        <div class="modal-content" >
            <div @click="profileModalShow = false" style="cursor: pointer;">
                <button style="right: 15px; position: absolute;" type="button" class="close border-0 mt-2 fs-4" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <form class="modal-body mx-5 px-5 py-4" v-on:submit.prevent="validateEditForm" >
                <p class="modal-title mt-4 text-center text-dark fw-bolder" style="font-size: 25px;">Edit Profile</p>

                <div class="mb-3 mt-3">
                    <label class="form-label fw-bolder fs-6">Name</label>
                    <input v-model = "tempAccount.name"
                        v-bind:class="{ 'is-valid': validation.valid.name, 'is-invalid': validation.invalid.name }" 
                        v-on:focus="clearValidation('name')" 
                        type="text" class="form-control">
                    <div class="valid-feedback" v-if="validation.valid.name">{{ validation.valid.name }}</div>
                    <div class="invalid-feedback" v-if="validation.invalid.name">{{ validation.invalid.name }}</div>
                </div>
                <div class="mb-3">
                    <label for="bio" class="form-label fw-bolder fs-6">Bio</label>
                    <textarea v-model = "bio" 
                        v-bind:class="{ 'is-valid': validation.valid.bio, 'is-invalid': validation.invalid.bio }" 
                        v-on:focus="clearValidation('bio')" 
                        rows="6" class="form-control" placeholder="120 characters MAX"></textarea>
                    <div class="valid-feedback" v-if="validation.valid.bio">{{ validation.valid.bio }}</div>
                    <div class="invalid-feedback" v-if="validation.invalid.bio">{{ validation.invalid.bio }}</div>
                </div>
                <!-- <button @click="updateProfile" type="button" class="btn btn-danger text-center" style="width: 100%;">Save</button> -->
                <button type="submit" class="btn btn-danger text-center my-4" style="width: 100%;">Save</button>

            </form>
            
        </div>
    </div>
  </Modal>
<!-- Modal Region -->

















</template>
<script>
import axios from 'axios';

export default {
    name: "Profile",
    data() {
        return {
            account: {
                name : '',
                address: '',
                bio: ''
            },
            tempAccount: {
                name : '',
                bio: ''
            },
            test: '',

            bio: '',
            townhalls : [],
            superwardens: [],
            masters: [],
            wardens: [],
            profileModalShow: false,
            validation: { 
                invalid: {},
                valid: {},},


        }
    },
    watch: {
		bio(newQuestion, oldQuestion) {	
			if(this.bio){
				if(this.bio.length > 120)
					this.bio = oldQuestion;
				else
					this.bio = newQuestion;
			}	
			this.tempAccount.bio = this.bio;
		},
	},
    computed: {
        

    },

    created() {
        this.getProfile()
    },
    mounted() {
        
    },
    methods: {
        trimmedAccountName(name){
            if (name.length > 12)
                return name.slice(0, 5) + "..." + name.slice(name.length - 5, name.length)
            else
                return name
        },
        trimmedAccountAddress(addr){
            if (addr.length > 10)
                return addr.slice(0, 5) + "..." + addr.slice(addr.length - 5, addr.length)
            else
                return addr
        },
        trimmedAccountBio(bio){
            if (bio.length > 95)
                return bio.slice(0, 5) + "..." + bio.slice(bio.length - 5, bio.length)
            else
                return bio
        },
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



        closeModal(){this.profileModalShow = false},
        editProfile(){
            this.profileModalShow = true
            // this.test = this.account.name
            this.tempAccount.name = this.account.name
            this.tempAccount.bio = this.account.bio
            this.bio = this.account.bio
            // this.tempAccount = this.account

        },

        async validateEditForm(){
            let update_flag = 0
            if (this.tempAccount.name != this.account.name){
                if (!this.tempAccount.name){
                    const response = await axios.get('https://superwarden.org/api/v1/search/accountName'+'?s='+this.tempAccount.name);
                    if (response.data.count > 0){
                        this.validation.invalid.name = 'This name is already taken.';
                        return
                    }
                }
                this.validation.valid.name = 'The name of townhall is valid';
            } else
                update_flag += 1
            if (this.tempAccount.bio != this.account.bio){

            } else 
                update_flag += 1
            if (update_flag == 2){
				this.$toast.error(`Nothing to update.`);
				return
			}
            this.updateProfile(this.tempAccount)
			this.resetValidation()
            


        },
        clearValidation: function(field) {
            this.validation.valid[field] = '';
            this.validation.invalid[field] = '';
        },
        resetValidation(){
			this.validation.valid = {}
            this.validation.invalid = {}
		},


    myFunction(){
      var copyText = this.account.address;
    //   copyText.select();
    //   copyText.setSelectionRange(0, 99999);
      navigator.clipboard.writeText(copyText);
      var tooltip = document.getElementById("myTooltip");
      tooltip.innerHTML = "Copied";
    },

        updateProfile(data){
            api.updateProfile({_addr : this.$store.getters._addr, account: data}, (async (res) => {
                this.account = res.data.account
                // this.tempAccount = res.data.account
                await this.$parent.$parent.getAccountData()
                this.profileModalShow = false
                this.$toast.success(`Updated your profile.`);

                this.getProfile()
            }), err =>{
                console.log(err)
            })

        },
        getProfile(){
            // console.log(this)
            api.getProfile({_addr : this.$store.getters._addr}, (res => {
                this.account = res.data.account
                console.log('profile')
                console.log(this.account)
                this.townhalls = []
                this.superwardens = []
                this.wardens = []
                this.townhalls = res.data.townhalls
                this.townhalls.map((item) => {
                    if (item.superwarden == this.account.address){
                        this.superwardens.push(item)
                    } else if (item.details.master.includes(this.account.name) || item.details.master.includes(this.account.address)){
                        this.masters.push(item);
                    } else if (item.details.warden.includes(this.account.name) || item.details.warden.includes(this.account.address)){
                        this.wardens.push(item);
                    }
                })
            }), err =>{
                console.log(err)
            })
        }
    }
}
</script>
<style>
.content {
  width: 100%;
  padding: 50px 40px;
  display: flex;
  max-width: 2000px;
  margin: 0px auto;
}

.left-block {
  border: 1px solid #959595;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
}

.left-block .head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left-block .head .title {
  font-weight: 700;
  font-size: 21px;
  color: #000000;
}

.left-block .head .coppy {
  border: 1px solid #959595;
  border-radius: 25px;
  padding: 8px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  column-gap: 5px;
}

.left-block .head .coppy>span {
  color: #959595;
  font-weight: 700;
}

.left-block .head .coppy>img {
  height: 20px;
}

.description {
  height: 65px;
}

.action-button {
  background: transparent;
  border: 1px solid rgba(148, 148, 148, 1);
  border-radius: 5px;
  padding: 10px;
  width: 150px;
}

.action-button span {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  font-size: 13.5px;
  color: #595959;
}

.block-container-profile {
  border: 1px solid #959595;
  flex-direction: column;
  border-radius: 5px;
  display: flex;
}

.block-head {
  height: 70px;
  border-bottom: 1px solid #959595;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 25px;
}

span.block-title {
  font-weight: 700;
  font-size: 18px;
  color: #959595;
}

.block-contect {
  display: flex;
  padding: 30px;
}

.items {
  display: flex;
  flex-wrap: wrap;
  column-gap: 20px;
}

.items>img {
  height: 60px;
  width: 60px;
  border-radius: 50%;
}

.avator {
  height: 150px;
  width: 150px;
  border-radius: 50%;
}

.villagers {
  font-weight: 700;
  font-size: 18px;
  color: #959595;
}

</style>