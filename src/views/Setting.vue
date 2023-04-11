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
      style="position: fixed; border-right: 1px solid #d5d5d5; height: 100%; z-index: 50; background-color: #fff;"
      class="lg:w-1/4 float-left hidden lg:block p-0 m-0 overflow-hidden"
      id="sidebar-left">
	<ul class="nav flex-column px-2">
		<li class="nav-item ">
			<!-- <a class="nav-link fontsize30">Settings</a> -->
			<p class="nav-link text-dark fw-bolder my-4 fs-3">Settings</p>
		</li>
		<li v-if = "role == 0" @click="setStep(1)" :class="steps == 1? 'navbar-active' : ''" class="nav-item" style="width: 100% !important;">
			<a class="nav-link disabled fw-bolder"  style="font-size: 16px;">Basic Info</a>
		</li>
		<li v-if = "role == 0" @click="setStep(2)" :class="steps == 2? 'navbar-active' : ''" class="nav-item">
			<a class="nav-link disabled fw-bolder"  style="font-size: 16px;">Social Media and Details</a>
		</li>
		<li v-if = "role == 0" @click="setStep(3)" :class="steps == 3? 'navbar-active' : ''" class="nav-item">
			<a class="nav-link disabled fw-bolder" style="font-size: 16px;">IPFS Settings and Visibility</a>
		</li>
		<li v-if = "role < 2" @click="setStep(4)" :class="steps == 4? 'navbar-active' : ''" class="nav-item">
			<a class="nav-link disabled fw-bolder" style="font-size: 16px;">Master Role Assignment</a>
		</li>
		<li v-if = "role == 0" @click="setStep(5)" :class="steps == 5? 'navbar-active' : ''" class="nav-item">
			<a class="nav-link disabled fw-bolder" style="font-size: 16px;">Warden Role Assignment</a>
		</li>
		<li v-if = "role == 0" @click="setStep(6)" :class="steps == 6? 'navbar-active' : ''" class="nav-item">
			<a class="nav-link disabled fw-bolder" style="font-size: 16px;">Proposal Publishing Permission</a>
		</li>
	</ul>
</div>
<div v-if = "loading"  style="width: 100%; height: 85%; display: flex; justify-content: center; vertical-align: middle; position: fixed; align-items: center; text-align: center;">

  <div>
    <img src="../assets/loader.gif" alt="this slowpoke moves"  width="150" class="ms-5"/>
  </div>
</div>
    <div v-else class="navBar" >
        <div class = "row" style="width: 100%;">
            <div class="col-lg-3 col-md-12 ">
            </div>
            <div class="col-lg-7 px-5 mx-5">
                <button type=" " class="btn btn-default  p-0 my-5" @click="backToProposalList"><b>&#8592; Back</b></button>
				<form v-if = "steps == 1"            v-on:submit.prevent="validateFirstStep" autocomplete="off"          >
					<p class="fw-bolder fs-4">Basic Info</p>
					<div class="mb-3 mt-3">
						<label for="name" class="form-label fw-bolder fs-6">Name of the townhall</label>
						<input v-model = "tempName" 
								v-bind:class="{ 'is-valid': validation.valid.name, 'is-invalid': validation.invalid.name }" 
                                v-on:focus="clearValidation('name')" 
								type="text" class="form-control" >
						<div class="valid-feedback" v-if="validation.valid.name">{{ validation.valid.name }}</div>
                        <div class="invalid-feedback" v-if="validation.invalid.name">{{ validation.invalid.name }}</div>
					</div>
					<div class="mb-3">
						<label for="category" class="form-label fw-bolder fs-6">Categories</label>
						<Multiselect    v-model="stepOne.categories"
										:options="categories"
										@select = "checkCategoryNumber"
										v-on:focus="clearValidation('categories')"
										v-bind:class="{ 'is-valid': validation.valid.categories, 'is-invalid': validation.invalid.categories }" 
										placeholder = "Choose 2 categories that best describe your townhall" mode="tags"
										track-by="name" label="name"
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
						<div class="valid-feedback" v-if="validation.valid.categories">{{ validation.valid.categories }}</div>
                        <div class="invalid-feedback" v-if="validation.invalid.categories">{{ validation.invalid.categories }}</div>
					</div>
					<div class="mb-3">
						<label for="bio" class="form-label fw-bolder fs-6">Bio</label>
						<textarea   v-model = "bio"
									v-bind:class="{ 'is-valid': validation.valid.bio, 'is-invalid': validation.invalid.bio }" 
									v-on:focus="clearValidation('bio')" 
									rows="6" placeholder="50 word max" class="form-control" ></textarea>
						<div class="valid-feedback" v-if="validation.valid.bio">{{ validation.valid.bio }}</div>
                        <div class="invalid-feedback" v-if="validation.invalid.bio">{{ validation.invalid.bio }}</div>
					</div>
					<div class="mb-3 mt-3">
						<label for="name" class="form-label fw-bolder fs-6">Avatar (Recommended | 250*250 pixel)</label>
						<input  v-model = "tempAvatar" 
						v-bind:class="{ 'is-valid': validation.valid.avatar, 'is-invalid': validation.invalid.avatar }" 
                                v-on:focus="clearValidation('avatar')" 
								type="text" class="form-control" placeholder="Image link">
						<div class="valid-feedback" v-if="validation.valid.avatar">{{ validation.valid.avatar }}</div>
                        <div class="invalid-feedback" v-if="validation.invalid.avatar">{{ validation.invalid.avatar }}</div>
					</div>
					<div class="mb-3 mt-3">
						<label for="name" class="form-label fw-bolder fs-6">Cover photo (Recommended | 1920*1080 pixel)</label>
						<input  v-model = "tempCoverPhoto" 
						v-bind:class="{ 'is-valid': validation.valid.coverPhoto, 'is-invalid': validation.invalid.coverPhoto }" 
                                v-on:focus="clearValidation('coverPhoto')" 
								type="text" class="form-control" placeholder="Image link">
						<div class="valid-feedback" v-if="validation.valid.coverPhoto">{{ validation.valid.coverPhoto }}</div>
                        <div class="invalid-feedback" v-if="validation.invalid.coverPhoto">{{ validation.invalid.coverPhoto }}</div>
					</div>
					<div class="mb-3 mt-3">
						<label for="slug" class="form-label fw-bolder fs-6">Slug</label>
						<div class="input-group ">
							<input  v-model = "tempSlug"
									v-on:focus="clearValidation('slug')" 
									type="text" class="form-control border-end-0" placeholder="Eg. superwarden">
							<span class="input-group-text fw-bolder" >.tron</span>
							<div class="valid-feedback " v-if="validation.valid.slug" style="display: flex;">{{ validation.valid.slug }}</div>
							<div class="invalid-feedback" v-if="validation.invalid.slug" style="display: flex;">{{ validation.invalid.slug }}</div>
						</div>
					</div>
					<button class="btn btn-danger float-end my-5 px-4 " type="submit">Update</button>
				</form>















				<form v-if = "steps == 2"      v-on:submit.prevent="validateSecondStep">
					<p class="fw-bolder fs-4">Social Media and Details</p>
					<div class="mb-3 mt-3">
						<label for="name" class="form-label fw-bolder fs-6" >Twitter</label>
						<input  v-model = "stepTwo.twitter" 
								v-bind:class="{ 'is-valid': validation.valid.twitter, 'is-invalid': validation.invalid.twitter }" 
                                v-on:focus="clearValidation('twitter')" 
								type="text" class="form-control"  placeholder="Eg. twitter.com/superwarden">
						<div class="valid-feedback" v-if="validation.valid.twitter">{{ validation.valid.twitter }}</div>
                        <div class="invalid-feedback" v-if="validation.invalid.twitter">{{ validation.invalid.twitter }}</div>
					</div>
					<div class="mb-3">
						<label for="bio" class="form-label fw-bolder fs-6">Discord</label>
						<input  v-model = "stepTwo.discord" 
								v-bind:class="{ 'is-valid': validation.valid.discord, 'is-invalid': validation.invalid.discord }" 
                                v-on:focus="clearValidation('discord')" 
								class="form-control" type="text"  placeholder="Eg. discord.gg/superwarden">
						<div class="valid-feedback" v-if="validation.valid.discord">{{ validation.valid.discord }}</div>
                        <div class="invalid-feedback" v-if="validation.invalid.discord">{{ validation.invalid.discord }}</div>
					</div>
					<div class="mb-3 mt-3">
						<label for="name" class="form-label fw-bolder fs-6">Github</label>
						<input  v-model = "stepTwo.github" 
								v-bind:class="{ 'is-valid': validation.valid.github, 'is-invalid': validation.invalid.github }" 
                                v-on:focus="clearValidation('github')"
								type="text" class="form-control" placeholder="Eg. github.com/superwarden">
						<div class="valid-feedback" v-if="validation.valid.github">{{ validation.valid.github }}</div>
                        <div class="invalid-feedback" v-if="validation.invalid.github">{{ validation.invalid.github }}</div>
					</div>
					<div class="mb-3 mt-3">
						<label for="name" class="form-label fw-bolder fs-6">Website/Forum</label>
						<input  v-model = "stepTwo.forum" 
								v-bind:class="{ 'is-valid': validation.valid.forum, 'is-invalid': validation.invalid.forum }" 
                                v-on:focus="clearValidation('forum')"
								type="text" class="form-control">
						<div class="valid-feedback" v-if="validation.valid.forum">{{ validation.valid.forum }}</div>
                        <div class="invalid-feedback" v-if="validation.invalid.forum">{{ validation.invalid.forum }}</div>
					</div>
					<div class="mb-3 mt-3">
						<label for="name" class="form-label fw-bolder fs-6">Details (markdown format)</label>
						<p style="font-size: 12px;">
							You can upload a more detail introduction of your townhall. This will be displayed in the tonwhall ‘Details’ section.
						</p>
						<input type="file" ref="markdown" @change="onMarkdownSelected" 
							accept=".md" style="display: none;"/>
						<div class="input-group mb-3"  @click.prevent="$refs.markdown.click()">
							<input  :value = "filename" 
									v-on:focus="clearValidation('details')"
									type="text" class="form-control border-end-0"  readonly placeholder="Upload you markdown file">
							<span class="input-group-text"><img src="../assets/upload.png" style="height: 22px" /></span>
							<div class="valid-feedback" v-if="validation.valid.details" style="display: flex;">{{ validation.valid.details }}</div>
							<div class="invalid-feedback" v-if="validation.invalid.details" style="display: flex;">{{ validation.invalid.details }}</div>
						</div>
					</div>
					<div class="mb-3 mt-3">
						<label for="name" class="form-label fw-bolder fs-6">Banner photo for ‘Details’ (Recommended | 1920*400 pixel)</label>
						<input  v-model = "tempBannerPhoto" 
								v-bind:class="{ 'is-valid': validation.valid.bannerPhoto, 'is-invalid': validation.invalid.bannerPhoto }" 
                                v-on:focus="clearValidation('bannerPhoto')"
								type="text" class="form-control" placeholder="Image link">
						<div class="valid-feedback" v-if="validation.valid.bannerPhoto">{{ validation.valid.bannerPhoto }}</div>
                        <div class="invalid-feedback" v-if="validation.invalid.bannerPhoto">{{ validation.invalid.bannerPhoto }}</div>
					</div>
					<button class="btn btn-danger float-end  my-5 px-4 " type="submit">Update</button>

				</form>




















				<form v-if = "steps == 3"  v-on:submit.prevent="validateThirdStep">
					<p class="fw-bolder fs-4">IPFS Settings and Visibility</p>
					<div class="mb-3 mt-3">
						<label for="name" class="form-label fw-bolder fs-6">Web3.storage API key</label>
						<input  v-model = "stepThree.webThrKey" 
								v-bind:class="{ 'is-valid': validation.valid.webThrKey, 'is-invalid': validation.invalid.webThrKey }" 
                                v-on:focus="clearValidation('webThrKey')"
								type="text" class="form-control" >
						<div class="valid-feedback" v-if="validation.valid.webThrKey">{{ validation.valid.webThrKey }}</div>
                        <div class="invalid-feedback" v-if="validation.invalid.webThrKey">{{ validation.invalid.webThrKey }}</div>
					</div>
					<div class="mb-3">
						<label for="bio" class="form-label fw-bolder fs-6">Pinata API key</label>
						<input  v-model = "stepThree.pinataKey" 
								class="form-control" type="text" >
					</div>
					<div class="mb-3 mt-3">
						<label for="name" class="form-label fw-bolder fs-6">Pinata API secret</label>
						<input v-model = "stepThree.pinataSecret" type="text" class="form-control">
					</div>
					<div class="mb-3 mt-3">
						<label for="name" class="form-label fw-bolder fs-6">Private townhall?</label>
						<p style="font-size: 12px;">
						If check, the townhall will not appear in World page. However, it is still accessible via URL link. ( Eg. superwarden.org/mydao.tron )
						</p>
						<div class="form-check form-switch ">
							<input v-model = "stepThree.private" class="form-check-input fs-5" style="margin-left: -40px;" type="checkbox">
						</div>
					</div>
					<button class="btn btn-danger float-end  my-5 px-4 " type="submit">Update</button>

				</form>















				<form v-if = "steps == 4"  v-on:submit.prevent="validateFourthStep">
					<p class="fw-bolder fs-4 mb-4">Assign Masters</p>
					<p class="fw-bolder" style="color: #959595; display: flex; font-size: 15px;"><img class="me-2" src="../assets/check.png" style="width: 25px;"/> Master can only create and publish proposal</p>
					<p class="fw-bolder" style="color: #959595; display: flex; font-size: 15px;"><img class="me-2" src="../assets/check.png" style="width: 25px;"/> Can only be assigned by superwarden and warden </p>
					<p class="fw-bolder" style="color: #959595; display: flex; font-size: 15px;"><img class="me-2" src="../assets/check.png" style="width: 25px;"/> Can only be removed by superwarden and warden  </p>
					<p class="fw-bolder" style="color: #959595; display: flex; font-size: 15px;"><img class="me-2" src="../assets/check.png" style="width: 25px;"/> You can edit the role assignment anytime</p>
					
					
					<p class="fs-5 fw-bolder mt-5">Masters</p>
					<p class="fw-bolder" style="color: #959595; font-size: 15px;">Format of assigning:</p>
					<p class="fw-bolder" style="color: #959595; font-size: 15px;">{{"Tronlink wallet address 1 < new line >"}}</p>
					<p class="fw-bolder" style="color: #959595; font-size: 15px;">{{"Tronlink wallet address 2 < new line >"}}</p>
					<p class="fw-bolder" style="color: #959595; font-size: 15px;">...</p>
			
					<p class="fw-bolder" style="color: #959595; font-size: 15px;">*Nickname should be all lowercase and no space allowed</p>
					<div class="mb-3 mt-2">
						<textarea 	v-model = "stepFour.master"  
									v-bind:class="{ 'is-valid': validation.valid.master, 'is-invalid': validation.invalid.master }" 
                                	v-on:focus="clearValidation('master')"
									rows="6" class="form-control"
									placeholder="Eg. 
TRzQrtxrEJbSbQNwAsgAHkBMxTX47yNmjo
TUjx6w55Nx9G4GjjRNEB4e7w5BUH3WmJTZ
TSF2rqLdrrZG7PZkDxtvu6B2PTpofidMAX"></textarea>
						<div class="valid-feedback" v-if="validation.valid.master">{{ validation.valid.master }}</div>
                        <div class="invalid-feedback" v-if="validation.invalid.master">{{ validation.invalid.master }}</div>
					</div>
					<button  type="submit" class="btn btn-danger float-end my-5 px-4">Update</button>

				</form>














				<form v-if = "steps == 5"     v-on:submit.prevent="validateFifthStep">
					<p class="fw-bolder fs-4 mb-4">Assign Wardens</p>
					<p class="fw-bolder" style="color: #959595; display: flex; font-size: 15px;"><img class="me-2" src="../assets/check.png" style="width: 25px; height: 25px;"/> Warden can create and publish proposal</p>
					<p class="fw-bolder" style="color: #959595; display: flex; font-size: 15px;"><img class="me-2" src="../assets/check.png" style="width: 25px; height: 25px;"/> Warden can broadcast announcement </p>
					<p class="fw-bolder" style="color: #959595; display: flex; font-size: 15px;"><img class="me-2" src="../assets/check.png" style="width: 25px; height: 25px;"/> Can only be assigned and removed by superwarden   </p>
					<p class="fw-bolder" style="color: #959595; display: flex; font-size: 15px;"><img class="me-2" src="../assets/check.png" style="width: 25px; height: 25px;"/> Warden can assign master</p>
					<p class="fw-bolder" style="color: #959595; display: flex; font-size: 15px;"><img class="me-2" src="../assets/check.png" style="width: 25px; height: 25px;"/> You can edit the role assignment anytime</p>
					<p class="fs-5 fw-bolder mt-5">Wardens</p>
					<p class="fw-bolder" style="color: #959595; font-size: 15px;">Format of assigning:</p>
					<p class="fw-bolder" style="color: #959595; font-size: 15px;">{{"Tronlink wallet address 1 < new line >"}}</p>
					<p class="fw-bolder" style="color: #959595; font-size: 15px;">{{"Tronlink wallet address 2 < new line >"}}</p>
					<p class="fw-bolder" style="color: #959595; font-size: 15px;">...</p>
			
					<p class="fw-bolder" style="color: #959595; font-size: 15px;">*Nickname should be all lowercase and no space allowed</p>
					<div class="mb-3 mt-2">
						<textarea 	v-model = "stepFive.warden" 
									v-bind:class="{ 'is-valid': validation.valid.warden, 'is-invalid': validation.invalid.warden }" 
                                	v-on:focus="clearValidation('warden')"
									rows="6" class="form-control"
									placeholder="Eg. 
TRzQrtxrEJbSbQNwAsgAHkBMxTX47yNmjo
TUjx6w55Nx9G4GjjRNEB4e7w5BUH3WmJTZ
TSF2rqLdrrZG7PZkDxtvu6B2PTpofidMAX"
						></textarea>
						<div class="valid-feedback" v-if="validation.valid.warden">{{ validation.valid.warden }}</div>
                        <div class="invalid-feedback" v-if="validation.invalid.warden">{{ validation.invalid.warden }}</div>
					</div>
					<button type="submit" class="btn btn-danger float-end my-5 px-4">Update</button>
				</form>

















				<form v-if = "steps == 6"   v-on:submit.prevent="validateSixthStep" >
					<p class="fw-bolder fs-4">Proposal Publishing Permission</p>
					<div class="form-check mt-3 mb-3">
						<input  class="form-check-input" type="checkbox" checked disabled id="flexCheckDefault">
						<label  class="form-check-label fw-bolder fs-6" for="flexCheckDefault" style="font-weight: bold;">
							Allow masters to create and publish proposal
						</label>
						<p class="fw-bolder" style="color: #959595; font-size: 14px;">This is the default proposal publishing permission and can be unticked. If the following two options are not chosen, this rule will apply automatically.</p>
					</div>
					<div class="form-check mt-3 mb-3">
						<input v-model = "stepSix.threshold.status" class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
						<label class="form-check-label fw-bolder fs-6" for="flexCheckDefault" style="font-weight: bold;">
							Anyone who exceeds the token threshold
						</label>
						<p class="fw-bolder" style="color: #959595; font-size: 14px;">If the token held by the user exceeds the token threshold set, he/she has the proposal publishing permission. </p>
						<div class="mb-3 mt-3">
							<label for="name" class="form-label fw-bolder fs-6">Token symbol</label>
							<input  v-model = "stepSix.threshold.tk_symbol" 
									v-bind:class="{ 'is-valid': validation.valid.tk_symbol, 'is-invalid': validation.invalid.tk_symbol }" 
                                	v-on:focus="clearValidation('tk_symbol')"
									type="text" class="form-control">
							<div class="valid-feedback" v-if="validation.valid.tk_symbol">{{ validation.valid.tk_symbol }}</div>
							<div class="invalid-feedback" v-if="validation.invalid.tk_symbol">{{ validation.invalid.tk_symbol }}</div>
						</div>
						<div class="mb-3 mt-3">
							<label for="name" class="form-label fw-bolder fs-6">Token address</label>
							<input  v-model = "stepSix.threshold.tk_addr"
									v-bind:class="{ 'is-valid': validation.valid.tk_addr, 'is-invalid': validation.invalid.tk_addr }" 
                                	v-on:focus="clearValidation('tk_addr')"
							 		type="text" class="form-control">
							<div class="valid-feedback" v-if="validation.valid.tk_addr">{{ validation.valid.tk_addr }}</div>
							<div class="invalid-feedback" v-if="validation.invalid.tk_addr">{{ validation.invalid.tk_addr }}</div>
						</div>
						<div class="mb-3 mt-3">
							<label for="name" class="form-label fw-bolder fs-6">Threshold</label>
							<input  v-model = "stepSix.threshold.threshold" 
									v-bind:class="{ 'is-valid': validation.valid.threshold, 'is-invalid': validation.invalid.threshold }" 
                                	v-on:focus="clearValidation('threshold')"
									type="number" class="form-control">
							<div class="valid-feedback" v-if="validation.valid.threshold">{{ validation.valid.threshold }}</div>
							<div class="invalid-feedback" v-if="validation.invalid.threshold">{{ validation.invalid.threshold }}</div>
						</div>
					</div>
					<div class="form-check mt-3 mb-3">
						<input v-model = "stepSix.tcr.status" class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
						<label class="form-check-label fw-bolder fs-6" for="flexCheckDefault" style="font-weight: bold;">
							Anyone with a specific TRC721
						</label>
						<p class="fw-bolder" style="color: #959595; font-size: 14px;">If he user hold a TRC721 token (NFT) of a specific collection, he/she has the proposal publishing permission.</p>
						<div class="mb-3 mt-3">
							<label for="name" class="form-label fw-bolder fs-6">Token symbol</label>
							<input  v-model = "stepSix.tcr.tk_symbol" 
									v-bind:class="{ 'is-valid': validation.valid.tcr_tk_symbol, 'is-invalid': validation.invalid.tcr_tk_symbol }" 
                                	v-on:focus="clearValidation('tcr_tk_symbol')"
									type="text" class="form-control">
							<div class="valid-feedback" v-if="validation.valid.tcr_tk_symbol">{{ validation.valid.tcr_tk_symbol }}</div>
							<div class="invalid-feedback" v-if="validation.invalid.tcr_tk_symbol">{{ validation.invalid.tcr_tk_symbol }}</div>
						</div>
						<div class="mb-3 mt-3">
							<label for="name" class="form-label fw-bolder fs-6">Token address</label>
							<input  v-model = "stepSix.tcr.tk_addr" 
									v-bind:class="{ 'is-valid': validation.valid.tcr_tk_addr, 'is-invalid': validation.invalid.tcr_tk_addr }" 
                                	v-on:focus="clearValidation('tcr_tk_addr')"
									type="text" class="form-control">
							<div class="valid-feedback" v-if="validation.valid.tcr_tk_addr">{{ validation.valid.tcr_tk_addr }}</div>
							<div class="invalid-feedback" v-if="validation.invalid.tcr_tk_addr">{{ validation.invalid.tcr_tk_addr }}</div>
						</div>
					</div>
					<button type="submit" class="btn btn-danger float-end my-5 px-4">Update</button>

				</form>

            </div>
        </div>
    </div>
</template>
<script>
import Multiselect from '@vueform/multiselect'
import axios from 'axios';
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'

export default {
    name: "Setting",
	components: { Multiselect, PulseLoader},
    data() {
        return {
          slug : this.$route.params['slug'],
		  details: {},
		  role: 10,

			categories : ['Media', 'Social', 'Entertainment', 'Protocol', 'Investment', 'Collectors', 'Grant', 'Art and Culture', 
			'Education', 'Research', 'Creator', 'Service'],
			tempData: {},
			steps: 1,
			superwarden: '',
			stepOne: {
				name: '',
				categories: null,
				bio: '',
				avatar: '',
				coverPhoto: '',
				slug: '',
			},
			bio:'',
			tempName: '',
			tempSlug: '',
			tempAvatar: '',
			tempCoverPhoto: '',
			stepTwo: {
				twitter: '',
				discord: '',
				github: '',
				forum: '',
				details: '',
				bannerPhoto: '',
			},
			filename: '',
			tempBannerPhoto: '',

			stepThree: {
				webThrKey: '',
				pinataKey: '',
				pinataSecret: '',
				private: false
			},
			stepFour: {
				master: ''
			},
			stepFive: {
				warden: ''
			},
			stepSix: {
				mtr_status : false, 
				threshold: {
					status: false,
					tk_symbol: '',
					tk_addr: '',
					threshold: '',
				},
				tcr: {
					status: false,
					tk_symbol: '',
					tk_addr: '',
				}
			},
						validation: { 
                invalid: {},
                valid: {},},
			loading: true
            // active: {status : false}

        }
    },
	watch: {
		bio(newQuestion, oldQuestion) {		
			if(this.bio){
				if(String(this.bio).match(/(\w+)/g).length > 50)
					this.bio = oldQuestion;
				else
					this.bio = newQuestion;
			}	
			this.stepOne.bio = this.bio;
		},
	},
    computed: {

    },

    created() {
		if (this.$store.getters.role > 1)
            this.$router.push(`/`)
        else
			this.getTownhallData()

    },
    mounted() {
        
    },
    methods: {
		resetValidation(){
			this.validation.valid = {}
            this.validation.invalid = {}
		},
		checkImageURL(uri){
			if (uri.startsWith('ipfs://') || uri.startsWith('ipns://') || uri.startsWith('https://') || uri.startsWith('http://'))
			{
				let ipfsGateway = 'https://ipfs.io'
				if (uri.startsWith('ipfs://')){
					return uri.replace('ipfs://', `${ipfsGateway}/ipfs/`);
				}
				if (uri.startsWith('ipns://')){
					return uri.replace('ipns://', `${ipfsGateway}/ipns/`);
				}
				return uri
			} else {
				return null
			}


		},
		clearValidation: function(field) {
            this.validation.valid[field] = '';
            this.validation.invalid[field] = '';
        },



		async validateFirstStep(){
			let update_flag = 0
			if(this.tempName != this.details.name){
				if (!this.tempName) {
					this.validation.invalid.name = 'Please type the name of your townhall.';
					return
				} else {
					
						const response = await axios.get('https://superwarden.org/api/v1/search/townhallName'+'?s='+this.tempName);
						if (response.data.count > 0){
							this.validation.invalid.name = 'This name is already taken.';
							return
						}
					this.stepOne.name = this.tempName
					this.validation.valid.name = 'The name of townhall is valid';
				}
			} else
				update_flag +=1
			if(this.stepOne.categories != this.details.categories){
				if (this.stepOne.categories.length < 2) {
					this.validation.invalid.categories = 'Choose 2 categories that best describe your townhall';
					return
				} else {
					this.validation.valid.categories = 'The category of townhall is valid';
				}
			} else
				update_flag +=1
			if(this.stepOne.bio != this.details.bio){
				if (!this.stepOne.bio) {
					this.validation.invalid.bio = 'Please type the bio of your townhall.';
					return
				} else {
					this.validation.valid.bio = 'The bio of townhall is valid';
				}
			} else
				update_flag +=1
			if (this.tempAvatar != this.details.avatar){
				if (!this.tempAvatar) {
					this.validation.invalid.avatar = 'Please type the url of your townhall avatar.';
					return
				} else {
					let url = await this.checkImageURL(this.tempAvatar)
					if (!url){
						this.validation.invalid.avatar = 'An invalid avatar url';
						return
					}
					this.stepOne.avatar = url
					this.validation.valid.avatar = 'The url of avatar is valid';
				}
			} else
				update_flag +=1
			if (this.tempCoverPhoto != this.details.coverPhoto){
				if (!this.tempCoverPhoto) {
					this.validation.invalid.coverPhoto = 'Please type the url of your cover photo.';
					return
				} else {
					let url = await this.checkImageURL(this.tempCoverPhoto)
					if (!url){
						this.validation.invalid.coverPhoto = 'An invalid avatar url';
						return
					}
					this.stepOne.coverPhoto = url
					this.validation.valid.coverPhoto = 'The url of cover photo is valid';
				}
            } else
				update_flag +=1
			if ((this.tempSlug + ".tron")!= this.details.slug){
				console.log(this.tempSlug + ".tron") 
				if (!this.tempSlug) {
					this.validation.invalid.slug = 'Please type the slug of your townhall.';
					return
				} else {
					let string = this.tempSlug + ".tron";
					const response = await axios.get('https://superwarden.org/api/v1/search/slugName'+'?s='+string);
					if (response.data.count > 0){
						this.validation.invalid.slug = 'This slug is already taken.';
						return
					}
					this.stepOne.slug = string
					this.validation.valid.slug = 'The slug of your townhall is valid';
				}
			} else
				update_flag +=1
			if (update_flag == 6){
				this.$toast.error(`No changes are made.`);
				return
			}
			Object.assign(this.details, this.stepOne)
			this.updateTownHall(this.details)
			this.resetValidation()
		},


		async validateSecondStep(){
			let update_flag = 0
			if(this.stepTwo.github != this.details.github){

				if (!this.stepTwo.twitter){
					this.validation.invalid.twitter = 'Please type the url of your twitter.';
					return
				} else {
					this.validation.valid.twitter = 'The url of your twitter is added.';
				}
			} else
				update_flag +=1


			if(this.stepTwo.discord != this.details.discord){

				if (!this.stepTwo.discord){
					this.validation.invalid.discord = 'Please type the url of your discord.';
					return
				} else {
					this.validation.valid.discord = 'The url of your discord is added.';
				}
			} else
				update_flag +=1


			if(this.stepTwo.github != this.details.github){
				if (!this.stepTwo.github){
					this.validation.invalid.github = 'Please type the url of your github.';
					return
				} else {
					this.validation.valid.github = 'The url of your github is added.';
				}
				
			} else
				update_flag +=1

			if(this.stepTwo.forum != this.details.forum){
				if (!this.stepTwo.forum){
					this.validation.invalid.forum = 'Please type the url of your forum.';
					return
				} else {
					this.validation.valid.forum = 'The url of your forum is added.';
				}
			} else
				update_flag +=1


			if(this.stepTwo.details != this.details.details){
				
				if (!this.stepTwo.details){
					// console.log('lafudkfjjfi')
					this.validation.invalid.details = 'Please insert md file for details.';
					return
				} else {
					this.validation.valid.details = 'The md file is loaded.';
				}
			} else
				update_flag +=1


			if(this.tempBannerPhoto != this.details.bannerPhoto){
				if (!this.tempBannerPhoto) {
					this.validation.invalid.bannerPhoto = 'Please type the url of your cover photo.';
					return
				} else {
					let url = await this.checkImageURL(this.tempBannerPhoto)
					if (!url){
						this.validation.invalid.bannerPhoto = 'An invalid avatar url';
						return
					}
					this.stepTwo.bannerPhoto = url
					this.validation.valid.bannerPhoto = 'The url of banner photo is valid';
				}
			} else
				update_flag +=1



			if (update_flag == 6){
				this.$toast.error(`No changes are made.`);
				return
			}

			Object.assign(this.details, this.stepTwo)
			this.updateTownHall(this.details)
			this.resetValidation()






			// this.steps = 3
			// this.resetValidation()
		},


		validateThirdStep(){
			let update_flag = 0
			if(this.stepThree.webThrKey != this.details.webThrKey){

				if (!this.stepThree.webThrKey){
					this.validation.invalid.webThrKey = 'Please type the API key of your web3.storage.';
					return
				} else {
					this.validation.valid.webThrKey = 'The API key of your web3.storage is added.';
				}
            } else
				update_flag +=1
			if(this.stepThree.pinataKey == this.details.pinataKey)
				update_flag +=1
			if(this.stepThree.pinataSecret == this.details.pinataSecret)
				update_flag += 1
			if(this.stepThree.private == this.details.private)
				update_flag += 1
			if (update_flag == 4){
				this.$toast.error(`No changes are made.`);
				return
			}
			Object.assign(this.details, this.stepThree)
			this.updateTownHall(this.details)
			this.resetValidation()
		},

		validateFourthStep(){
			if (this.stepFour.master == this.details.master){
				this.$toast.error(`No changes are made.`);
				return
			}
			Object.assign(this.details, this.stepFour)
			this.updateTownHall(this.details)
			this.resetValidation()
		},

		validateFifthStep(){
			if (this.stepFive.warden == this.details.warden){
				this.$toast.error(`No changes are made.`);
				return
			}
			Object.assign(this.details, this.stepFive)
			this.updateTownHall(this.details)
			// this.steps = 6
			this.resetValidation()
		},

		// backToProposalList(){backToProposalList(){this.$router.push(`/${this.proposal.slug}/proposal`)},}
		backToProposalList(){this.$router.push(`/${this.slug}/proposal`)},

		validateSixthStep(){
			let update_flag = 0
			if (this.stepSix.threshold.status == this.details.threshold.status)
				update_flag +=1
			if (this.stepSix.tcr.status == this.details.tcr.status)
				update_flag +=1
			


			if (this.stepSix.threshold.tk_symbol != this.details.threshold.tk_symbol){
				if (!this.stepSix.threshold.tk_symbol){
					this.validation.invalid.tk_symbol = 'Please type the symbol of your threshold.';
					return
				} else {
					this.validation.valid.tk_symbol = 'The symbol of your threshold is added.';
				}
			} else
				update_flag +=1
			
			if (this.stepSix.threshold.tk_addr != this.details.threshold.tk_addr){
				if (!this.stepSix.threshold.tk_addr){
					this.validation.invalid.tk_addr = 'Please type the address of your threshold.';
					return
				} else {
					this.validation.valid.tk_addr = 'The address of your threshold is added.';
				}
			} else
				update_flag +=1
			
			if (this.stepSix.threshold.threshold != this.details.threshold.threshold){
				if (!this.stepSix.threshold.threshold){
					this.validation.invalid.threshold = 'Please type the threshold of your threshold.';
					return
				} else {
					this.validation.valid.threshold = 'The threshold of your threshold is added.';
				}
			} else
				update_flag +=1
			
			if (this.stepSix.tcr.tk_symbol != this.details.tcr.tk_symbol){
				if (!this.stepSix.tcr.tk_symbol){
					this.validation.invalid.tcr_tk_symbol = 'Please type the symbol of your TRC721.';
					return
				} else {
					this.validation.valid.tcr_tk_symbol = 'The symbol of your TRC721 is added.';
				}
			} else
				update_flag +=1

			if (this.stepSix.tcr.tk_addr != this.details.tcr.tk_addr){
				if (!this.stepSix.tcr.tk_addr){
                this.validation.invalid.tcr_tk_addr = 'Please type the address of your TRC721.';
					return
				} else {
					this.validation.valid.tcr_tk_addr = 'The address of your TRC721 is added.';
				}
			} else
				update_flag +=1

			if (update_flag == 7){
				this.$toast.error(`No changes are made.`);
				return
			}

			Object.assign(this.details, this.stepSix)
			this.updateTownHall(this.details)
			this.resetValidation()
		},














		getTownhallData(){
			this.loading = true
			api.getTownhallData({slug: this.slug}, (res => {
				
				if (res.data.townhall){
						console.log(res.data.townhall)
					this.details = res.data.townhall.details
					this.superwarden = res.data.townhall.superwarden
					console.log(this.details)
					if (res.data.townhall.superwarden == this.$store.getters._addr){
						this.role = 0
					} else if (this.details.warden.includes(this.$store.getters.name) || this.details.warden.includes(this.$store.getters._addr)){
						this.role = 1
						this.steps = 4
					} else if (this.details.master.includes(this.$store.getters.name) || this.details.master.includes(this.$store.getters._addr)){
						this.role = 2
						this.steps = 0
					} else {
						this.role = 3
						this.steps = 0
					}
					//#region step One
					this.stepOne.name = res.data.townhall.details.name
					this.tempName = res.data.townhall.details.name
					this.stepOne.categories = res.data.townhall.details.categories
					this.stepOne.bio = res.data.townhall.details.bio
					this.bio = res.data.townhall.details.bio
					this.stepOne.avatar = res.data.townhall.details.avatar
					this.tempAvatar = res.data.townhall.details.avatar
					this.stepOne.coverPhoto = res.data.townhall.details.coverPhoto
					this.tempCoverPhoto = res.data.townhall.details.coverPhoto
					this.stepOne.slug = res.data.townhall.details.slug
					this.tempSlug = res.data.townhall.details.slug
					this.tempSlug = res.data.townhall.details.slug.substring(0, res.data.townhall.details.slug.length - 5)
					//#endregion

					// stepTwo
					this.stepTwo.bannerPhoto = res.data.townhall.details.bannerPhoto
					this.tempBannerPhoto = res.data.townhall.details.bannerPhoto
					this.stepTwo.discord = res.data.townhall.details.discord
					this.stepTwo.forum = res.data.townhall.details.forum
					this.stepTwo.github = res.data.townhall.details.github
					this.stepTwo.twitter = res.data.townhall.details.twitter
					this.stepTwo.details = res.data.townhall.details.details
					if (res.data.townhall.details.details){
						this.filename = "already uploaded"
					}
					// stepThree
					this.stepThree.pinataKey = res.data.townhall.details.pinataKey
					this.stepThree.webThrKey = res.data.townhall.details.webThrKey
					this.stepThree.pinataSecret = res.data.townhall.details.pinataSecret
					this.stepThree.private = res.data.townhall.details.private
					// stepFour
					this.stepFour.master = res.data.townhall.details.master
					// stepFive
					this.stepFive.warden = res.data.townhall.details.warden
					// stepSix
					this.stepSix.tcr = res.data.townhall.details.tcr
					this.stepSix.mtr_status = res.data.townhall.details.mtr_status
					this.stepSix.threshold = res.data.townhall.details.threshold
					this.loading = false
				} else {

				}
				}), err =>{
					console.log(err)
			})
		},

//#region validation part
		checkCategoryNumber(){
			console.log(this.stepOne.categories)
			if (this.stepOne.categories.length > 2){
				this.stepOne.categories = this.stepOne.categories.slice(0,2)
				return
			}
		},

		//#endregion











		onMarkdownSelected(file){
			console.log(file)
			if (typeof file !== 'undefined') {
				this.filename = file.target.files[0].name
				var reader = new FileReader();
				reader.readAsText(file.target.files[0]);
				reader.onloadend = async () => {
					this.stepTwo.details = reader.result
				};
			}

		},
		updateStepTownHall(i){
			if (i == 1){
				Object.assign(this.details, this.stepOne)
			} else if (i == 2){
				Object.assign(this.details, this.stepTwo)
			} else if (i == 3){
				Object.assign(this.details, this.stepThree)
			} else if (i == 4){
				Object.assign(this.details, this.stepFour)
			} else if (i == 5){
				Object.assign(this.details, this.stepFive)
			} else {
				Object.assign(this.details, this.stepSix)
			}
			this.updateTownHall(this.details)

		},
		updateTownHall(data){
			api.updateTownHall({slug: this.slug, data: data, superwarden: this.superwarden}, (res => {
				this.details = res.data.data.details
                this.$toast.success(`Townhall update saved.`);

			}), err =>{
				console.log(err)
			})

		},
		setStep(i){
			this.steps = i
		},
        getMyTownhall(){
            api.getMyTownhall({_addr: this.$store.getters._addr}, (res => {
				this.details = res.data.data.details
				// stepOne
				this.stepOne.name = res.data.data.details.name
				this.stepOne.categories = res.data.data.details.categories
				this.stepOne.bio = res.data.data.details.bio
				this.stepOne.avatar = res.data.data.details.avatar
				this.stepOne.coverPhoto = res.data.data.details.coverPhoto
				this.stepOne.slug = res.data.data.details.slug
				// stepTwo
				this.stepTwo.bannerPhoto = res.data.data.details.bannerPhoto
				this.stepTwo.discord = res.data.data.details.discord
				this.stepTwo.forum = res.data.data.details.forum
				this.stepTwo.github = res.data.data.details.github
				this.stepTwo.twitter = res.data.data.details.twitter
				this.stepTwo.details = res.data.data.details.details
				if (res.data.data.details.details){
					this.filename = "already uploaded"
				}
				// stepThree
				this.stepThree.pinataKey = res.data.data.details.pinataKey
				this.stepThree.webThrKey = res.data.data.details.webThrKey
				this.stepThree.pinataSecret = res.data.data.details.pinataSecret
				this.stepThree.private = res.data.data.details.private
				// stepFour
				this.stepFour.master = res.data.data.details.master
				// stepFive
				this.stepFive.warden = res.data.data.details.warden
				// stepSix
				this.stepSix.tcr = res.data.data.details.tcr
				this.stepSix.mtr_status = res.data.data.details.mtr_status
				this.stepSix.threshold = res.data.data.details.threshold
			}), err =>{
				console.log(err)
			})
        }
    }
}
</script>
<style src="@vueform/multiselect/themes/default.css"></style>

<style>

.navBar {
    margin-left: 35px;
}

.navBar li a {
    /* color: #595959; */
    font-weight: 900;
}

.navbar-active {
    background-color:#EEEEEE;
}
.p--30 {
    padding: 90px;
}

</style>