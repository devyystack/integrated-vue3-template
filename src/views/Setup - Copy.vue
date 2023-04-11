<template>
    <div>
        <div class="row navBar">
			<div class="col-lg-7 p--30">
                    <h1>Creat TownHall</h1>
					<div v-if ="steps == 1">
						<h4>1. Basic Info</h4>
						<div class="mb-3 mt-3">
							<label for="name" class="form-label">Name of the townhall</label>
							<input type="text" class="form-control" v-model = "stepOne.name">
						</div>
						<div class="mb-3">
							<label for="category" class="form-label">Categories</label>
							<Multiselect placeholder = "Choose 2 categories that best describe your townhall"
								mode="tags"
								v-model="stepOne.categories"
								track-by="name"
								label="name"
								:options="categories"
							>
								<template v-slot:tag="{ option, handleTagRemove, disabled }">
									<div class="multiselect-tag is-user"
										:class="{
											'is-disabled': disabled
										}"
										>
									{{ option.name }}
									<span
										v-if="!disabled"
										class="multiselect-tag-remove"
										@click="handleTagRemove(option, $event)"
									>
										<span class="multiselect-tag-remove-icon"></span>
									</span>
									</div>
								</template>
							</Multiselect>
						</div>
						<div class="mb-3">
							<label for="bio" class="form-label">Bio</label>
							<textarea rows="6" class="form-control" v-model = "stepOne.bio"></textarea>
						</div>
						<div class="mb-3 mt-3">
							<label for="name" class="form-label">Avatar (Recommended | 250*250 pixel)</label>
							<input v-model = "stepOne.avatar" type="text" class="form-control" placeholder="Image link">
						</div>
						<div class="mb-3 mt-3">
							<label for="name" class="form-label">Cover photo (Recommended | 1920*1080 pixel)</label>
							<input v-model = "stepOne.coverPhoto" type="text" class="form-control" placeholder="Image link">
						</div>
						<div class="mb-3 mt-3">
							<label for="slug" class="form-label">Slug</label>
							<div class="input-group ">
								<input v-model = "stepOne.slug" type="text" class="form-control" placeholder="Recipient's username">
								<span class="input-group-text" >.tron</span>
							</div>
						</div>
						<button class="btn btn-danger float-end mt-3 px-4" @click = "nextStep">Next</button>
					</div>
					<div v-if ="steps == 2">
						<h4>2. Social Media and Details</h4>
						<div class="mb-3 mt-3">
							<label for="name" class="form-label">Twitter</label>
							<input type="text" class="form-control" v-model = "stepTwo.twitter" placeholder="Eg. twitter.com/superwarden">
						</div>
						<div class="mb-3">
							<label for="bio" class="form-label">Discord</label>
							<input class="form-control" type="text" v-model = "stepTwo.discord" placeholder="Eg. discord.gg/superwarden">
						</div>
						<div class="mb-3 mt-3">
							<label for="name" class="form-label">Github</label>
							<input v-model = "stepTwo.github" type="text" class="form-control" placeholder="Eg. discord.gg/superwarden">
						</div>
						<div class="mb-3 mt-3">
							<label for="name" class="form-label">Website/Forum</label>
							<input v-model = "stepTwo.forum" type="text" class="form-control">
						</div>
						<div class="mb-3 mt-3">
							<label for="name" class="form-label">Details (markdown format)</label>
							<p style="font-size: 12px;"
							>You can upload a more detail introduction of your townhall. This will be displayed in the tonwhall ‘Details’ section.
							</p>
							<input v-model = "stepTwo.details" placeholder="Upload you markdown file"
								type="text" class="form-control" style="background-image: url('src/assets/upload.png'); 
								background-repeat: no-repeat; background-position: 99%; background-size: 25px 25px;">
						</div>
						<div class="mb-3 mt-3">
							<label for="name" class="form-label">Banner photo for ‘Details’ (Recommended | 1920*400 pixel)</label>
							<input v-model = "stepTwo.bannerPhoto" type="text" class="form-control" placeholder="Image link">
						</div>
						<div>
							<button type=" " class="btn btn-default float-start mt-3 px-4" @click="prevStep"><b>&#8592; Back</b></button>
							<button type=" " class="btn btn-danger float-end mt-3 px-4" @click="nextStep">Next</button>
						</div>
					</div>
					<div v-if ="steps == 3">
						<h4>3. IPFS Settings and Visibility</h4>
						<div class="mb-3 mt-3">
							<label for="name" class="form-label">Web3.storage API key</label>
							<input type="text" class="form-control" v-model = "stepThree.web3">
						</div>
						<div class="mb-3">
							<label for="bio" class="form-label">Pinata API key</label>
							<input class="form-control" type="text" v-model = "stepThree.pinataKey" placeholder="Eg. discord.gg/superwarden">
						</div>
						<div class="mb-3 mt-3">
							<label for="name" class="form-label">Pinata API secret</label>
							<input v-model = "stepThree.pinataSecret" type="text" class="form-control" placeholder="Eg. discord.gg/superwarden">
						</div>
						<div class="mb-3 mt-3">
							<label for="name" class="form-label">Private townhall?</label>
							<p style="font-size: 12px;">
							If check, the townhall will not appear in World page. However, it is still accessible via URL link. ( Eg. superwarden.org/mydao.tron )
							</p>
							<div class="form-check form-switch">
								<input v-model = "stepThree.private" class="form-check-input" type="checkbox">
							</div>
						</div>
						<div>
							<button type=" " class="btn btn-default float-start mt-3 px-4" @click="prevStep"><b>&#8592; Back</b></button>
							<button type=" " class="btn btn-danger float-end mt-3 px-4" @click="nextStep">Next</button>
						</div>
					</div>
					<div v-if ="steps == 4">
						<h4>4. Assign Masters</h4>
						<p><img src="../assets/check.png" style="width: 25px;"/> Master can only create and publish proposal</p>
						<p><img src="../assets/check.png" style="width: 25px;"/> Can only be assigned by superwarden and warden </p>
						<p><img src="../assets/check.png" style="width: 25px;"/> Can only be removed by superwarden and warden  </p>
						<p><img src="../assets/check.png" style="width: 25px;"/> You can edit the role assignment anytime</p>
						<p>...</p>
						<br/>
						<p>*Nickname should be all lowercase and no space allowed</p>
						<h5 class="my-3">Masters</h5>
						<p>Format of assigning:</p>
						<p>{{"Tronlink wallet address 1 < SPACE > nickname < new line >< /new >"}}</p>
						<p>{{"Tronlink wallet address 2 < SPACE > nickname < new line >"}}</p>
						<p>...</p>
				
						<p>*Nickname should be all lowercase and no space allowed</p>
						<div class="mb-3 mt-2">
							<textarea rows="6" class="form-control"
								placeholder="Eg. 
TRzQrtxrEJbSbQNwAsgAHkBMxTX47yNmjo jimmy
TUjx6w55Nx9G4GjjRNEB4e7w5BUH3WmJTZ johnny
TSF2rqLdrrZG7PZkDxtvu6B2PTpofidMAX mary"
							></textarea>
						</div>
						<div>
							<button type=" " class="btn btn-default float-start mt-3 px-4" @click="prevStep"><b>&#8592; Back</b></button>
							<button type=" " class="btn btn-danger float-end mt-3 px-4" @click="nextStep">Next</button>
						</div>
					</div>
			</div>
		</div>
    </div>
	<div>

  </div>
</template>
<script>
// import Multiselect from 'vue-multiselect'
// import { ref } from 'vue'
import Multiselect from '@vueform/multiselect'
// Vue.component('multiselect', Multiselect)
export default {
    name: "Setup",
	components: { Multiselect},
    data() {
        return {
			 value: [],

			categories : ['Media', 'Social', 'Entertainment', 'Protocol', 'Investment', 'Collectors', 'Grant', 'Art and Culture', 
			'Education', 'Research', 'Creator', 'Service'],
			steps: 1,
			stepOne: {
				name: '',
				categories: null,
				bio: '',
				avatar: '',
				coverPhoto: '',
				slug: '',
			},
			stepTwo: {
				twitter: '',
				discord: '',
				github: '',
				forum: '',
				details: '',
				bannerPhoto: '',
			},
			stepThree: {
				web3: '',
				pinataKey: '',
				pinataSecret: '',
				private: false

			},
			
			search: ''
            // active: {status : false}

        }
    },
    computed: {

    },

    created() {

    },
    mounted() {
        
    },
    methods: {
		nextStep(){
			console.log(this.stepThree)
			this.steps +=1
		},
		prevStep(){
			console.log(this.stepThree)
			this.steps -=1
		},
		    change(val) {
				console.log(val)
				console.log(this.search)
    //   this.$router.push(val.path)
    //   this.search = ''
    //   this.options = []
    //   this.$nextTick(() => {
    //     this.show = false
    //   })
    },
    }
}
</script>
<style src="@vueform/multiselect/themes/default.css"></style>
<style>
.multiselect-tag.is-user {
    padding: 5px 8px;
    border-radius: 22px;
    background: #35495e;
    margin: 3px 3px 8px;
  }

  .multiselect-tag.is-user img {
    width: 18px;
    border-radius: 50%;
    height: 18px;
    margin-right: 8px;
    border: 2px solid #ffffffbf;
  }

  .multiselect-tag.is-user i:before {
    color: #ffffff;
    border-radius: 50%;;
  }

  .user-image {
    margin: 0 6px 0 0;
    border-radius: 50%;
    height: 22px;
  }</style>

<!-- <script>

import api from './api'

export default {
    name: "index",
    data() {
        return {

            // active: {status : false}

        }
    },
    computed: {

    },

    created() {

    },
    mounted() {
        
    },
    methods: {
    }
}
</script> -->