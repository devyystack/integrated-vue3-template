<template>
    <div style="padding-left: 35px; margin-left: 100px;">
        <!-- <div class="" style=""> -->
			<p class="my-5 pt-5 fw-bolder fs-1 text-dark">Create a townhall</p>
			



			<form v-if ="steps == 1"               v-on:submit.prevent="validateFirstStep" autocomplete="off"               class="row mb-5" style="width: 95%;">
				<div class="col-lg-6">
					<p class="fw-bolder fs-4">1. Basic Info</p>
					<div class="mb-3 mt-4">
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
										placeholder = "2 categories that best describe your townhall" mode="tags"
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
					<button class="btn btn-danger float-end mt-3 px-5 " type="submit">Next</button>
				</div>
			</form>

















			<form v-if ="steps == 2"    v-on:submit.prevent="validateSecondStep" autocomplete="off"    class="row mb-5" style="width: 95%;">
				<div class="col-lg-6">
					<p class="fw-bolder fs-4">2. Social Media and Details</p>
					<div class="mb-3 mt-4">
						<label for="name" class="form-label fw-bolder fs-6" >Twitter</label>
						<input  v-model = "stepTwo.twitter" 
								v-bind:class="{ 'is-valid': validation.valid.twitter, 'is-invalid': validation.invalid.twitter }" 
                                v-on:focus="clearValidation('twitter')" 
								type="text" class="form-control"  placeholder="Eg. https://twitter.com/superwarden">
						<div class="valid-feedback" v-if="validation.valid.twitter">{{ validation.valid.twitter }}</div>
                        <div class="invalid-feedback" v-if="validation.invalid.twitter">{{ validation.invalid.twitter }}</div>
					</div>
					<div class="mb-3">
						<label class="form-label fw-bolder fs-6">Discord</label>
						<input  v-model = "stepTwo.discord" 
								v-bind:class="{ 'is-valid': validation.valid.discord, 'is-invalid': validation.invalid.discord }" 
                                v-on:focus="clearValidation('discord')" 
								class="form-control" type="text"  placeholder="Eg. https://discord.gg/superwarden">
						<div class="valid-feedback" v-if="validation.valid.discord">{{ validation.valid.discord }}</div>
                        <div class="invalid-feedback" v-if="validation.invalid.discord">{{ validation.invalid.discord }}</div>
					</div>
					<div class="mb-3 mt-3">
						<label for="name" class="form-label fw-bolder fs-6">Github</label>
						<input  v-model = "stepTwo.github" 
								v-bind:class="{ 'is-valid': validation.valid.github, 'is-invalid': validation.invalid.github }" 
                                v-on:focus="clearValidation('github')"
								type="text" class="form-control" placeholder="Eg. https://github.com/superwarden">
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
					<div>
						<button type=" " class="btn btn-default float-start mt-3 p-0" @click="prevStep"><b>&#8592; Back</b></button>
						<button type="submit" class="btn btn-danger float-end mt-3 px-5">Next</button>
					</div>
				</div>
			</form>























			<form v-if ="steps == 3"   v-on:submit.prevent="validateThirdStep" class="row mb-5" style="width: 95%;">
				<div class="col-lg-6">
					<p class="fw-bolder fs-4">3. IPFS Settings and Visibility</p>
					<div class="mb-3 mt-4">
						<label for="name" class="form-label fw-bolder fs-6">Web3.storage API key</label>
						<input  v-model = "stepThree.webThrKey" 
								v-bind:class="{ 'is-valid': validation.valid.webThrKey, 'is-invalid': validation.invalid.webThrKey }" 
                                v-on:focus="clearValidation('webThrKey')"
								type="text" class="form-control" >
						<div class="valid-feedback" v-if="validation.valid.webThrKey">{{ validation.valid.webThrKey }}</div>
                        <div class="invalid-feedback" v-if="validation.invalid.webThrKey">{{ validation.invalid.webThrKey }}</div>
					</div>
					<div class="mb-3">
						<label class="form-label fw-bolder fs-6">Pinata API key</label>
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
					<div>
						<button type=" " class="btn btn-default float-start mt-3 p-0" @click="prevStep"><b>&#8592; Back</b></button>
												<button type="submit" class="btn btn-danger float-end mt-3 px-5">Next</button>

					</div>
				</div>
			</form>











			<form v-if ="steps == 4"    v-on:submit.prevent="validateFourthStep"    class="row mb-5" style="width: 95%;">
				<div class="col-lg-6">
					<p class="fw-bolder fs-4 superwarden-sm-f">4. Assign Masters</p>
					<p class="fw-bolder superwarden-sm-f mt-4" style="color: #959595; display: flex;"><img class="me-2" src="../assets/check.png" style="width: 25px;"/> Master can only create and publish proposal</p>
					<p class="fw-bolder superwarden-sm-f" style="color: #959595; display: flex;"><img class="me-2"  src="../assets/check.png" style="width: 25px;"/> Can only be assigned by superwarden and warden </p>
					<p class="fw-bolder superwarden-sm-f" style="color: #959595;display: flex;"><img class="me-2"  src="../assets/check.png" style="width: 25px;"/> Can only be removed by superwarden and warden  </p>
					<p class="fw-bolder superwarden-sm-f" style="color: #959595;display: flex;"><img class="me-2"  src="../assets/check.png" style="width: 25px;"/> You can edit the role assignment anytime</p>
					
					
					<p class="fs-5 fw-bolder mt-5">Masters</p>
					<p class="fw-bolder superwarden-sm-f" style="color: #959595;">Format of assigning:</p>
					<p class="fw-bolder superwarden-sm-f" style="color: #959595;">{{"Tronlink wallet address 1 < new line >"}}</p>
					<p class="fw-bolder superwarden-sm-f" style="color: #959595;">{{"Tronlink wallet address 2 < new line >"}}</p>
					<p class="fw-bolder superwarden-sm-f" style="color: #959595;">...</p>
			
					<p class="fw-bolder superwarden-sm-f" style="color: #959595;">*Nickname should be all lowercase and no space allowed</p>
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
					<div>
						<button type=" " class="btn btn-default float-start mt-3 p-0" @click="prevStep"><b>&#8592; Back</b></button>
												<button type="submit" class="btn btn-danger float-end mt-3 px-5">Next</button>

					</div>
				</div>
				<div class="col-lg-5" style="position: relative;">
					<img src="../assets/master.png" alt="" style="height: 50%; position: absolute; bottom: 0;">
				</div>
			</form>


















			<form v-if ="steps == 5"    v-on:submit.prevent="validateFifthStep" class="row mb-5" style="width: 95%;">
				<div class="col-lg-6">
					<p class="fw-bolder fs-4">5. Assign Wardens</p>
					<p class="fw-bolder mt-4 superwarden-sm-f superwarden-sm-f" style="color: #959595; display: flex;"><img class = "me-2" src="../assets/check.png" style="width: 25px;"/> Warden can create and publish proposal</p>
					<p class="fw-bolder superwarden-sm-f" style="color: #959595; display: flex;"><img class = "me-2" src="../assets/check.png" style="width: 25px;"/> Warden can broadcast announcement </p>
					<p class="fw-bolder superwarden-sm-f" style="color: #959595; display: flex;"><img class = "me-2" src="../assets/check.png" style="width: 25px;"/> Can only be assigned and removed by superwarden   </p>
					<p class="fw-bolder superwarden-sm-f" style="color: #959595; display: flex;"><img class = "me-2" src="../assets/check.png" style="width: 25px;"/> Warden can assign master</p>
					<p class="fw-bolder superwarden-sm-f" style="color: #959595; display: flex;"><img class = "me-2" src="../assets/check.png" style="width: 25px;"/> You can edit the role assignment anytime</p>
					<p class="fs-5 fw-bolder mt-5">Wardens</p>
					<p class="fw-bolder superwarden-sm-f" style="color: #959595;">Format of assigning:</p>
					<p class="fw-bolder superwarden-sm-f" style="color: #959595;">{{"Tronlink wallet address 1 < new line >"}}</p>
					<p class="fw-bolder superwarden-sm-f" style="color: #959595;">{{"Tronlink wallet address 2 < new line >"}}</p>
					<p class="fw-bolder superwarden-sm-f" style="color: #959595;">...</p>
			
					<p class="fw-bolder superwarden-sm-f" style="color: #959595;">*Nickname should be all lowercase and no space allowed</p>
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
					<div>
						<button type=" " class="btn btn-default float-start mt-3 p-0" @click="prevStep"><b>&#8592; Back</b></button>
												<button type="submit" class="btn btn-danger float-end mt-3 px-5">Next</button>

					</div>
				</div>
				<div class="col-lg-5" style="position: relative;">
					<img src="../assets/warden.png" alt="" style="height: 50%; position: absolute; bottom: 0;">
				</div>
			</form>




















			<form v-if ="steps == 6"    v-on:submit.prevent="validateSixthStep"    class="row mb-5" style="width: 95%;">
				<div class="col-lg-6">
					<p class="fw-bolder fs-4">6. Proposal Publishing Permission</p>
					<div class="form-check mt-4 mb-3">
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
					<div>
						<button type=" " class="btn btn-default float-start mt-3 p-0" @click="prevStep"><b>&#8592; Back</b></button>
												<button type="submit" class="btn btn-danger float-end mt-3 px-5">Next</button>

					</div>
				</div>
			</form>




			<div v-if ="steps == 7 " class="row mb-5" style="width: 95%;">
				<div class="col-lg-6">
					<p class="fw-bolder fs-4">7. Understanding your role | Superwarden</p>
					<p class="fw-bolder mt-4" style="color: #959595; display: flex;"><img class="me-2" src="../assets/check.png" style="width: 25px;"/> Superwarden can create and publish proposal</p>
					<p class="fw-bolder superwarden-sm-f" style="color: #959595; display: flex;"><img class="me-2" src="../assets/check.png" style="width: 25px;"/> Superwarden can broadcast announcement</p>
					<p class="fw-bolder superwarden-sm-f" style="color: #959595; display: flex;"><img class="me-2" src="../assets/check.png" style="width: 25px;"/> Can’t be removed by anyone</p>
					<p class="fw-bolder superwarden-sm-f" style="color: #959595; display: flex;"><img class="me-2" src="../assets/check.png" style="width: 25px;"/> Can remove warden and master</p>
					<p class="fw-bolder superwarden-sm-f" style="color: #959595; display: flex;"><img class="me-2" src="../assets/check.png" style="width: 25px;"/> Superwarden can assign warden and master</p>
					<p class="fw-bolder superwarden-sm-f" style="color: #959595; display: flex;"><img class="me-2" src="../assets/check.png" style="width: 25px;"/> Superwarden can edit townhall settings</p>
					<p class="fw-bolder superwarden-sm-f" style="color: #959595; display: flex;"><img class="me-2" src="../assets/check.png" style="width: 25px;"/> Every townhall has only one superwarden</p>
					<div class="form-check mt-5 mb-3">
						<input v-model= "stepSeven.role" class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
						<label class="form-check-label form-label fw-bolder fs-6" for="flexCheckDefault" style="font-weight: bold;">
							I understand my role as a superwarden.
						</label>
					</div>
					<div  class="form-check mt-3 mb-3">
						<input v-model= "stepSeven.oneTownhall" class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
						<label class="form-check-label form-label fw-bolder fs-6 " for="flexCheckDefault" style="font-weight: bold;">
							I understand this is the only townhall I can create (one wallet, one townhall).
						</label>
					</div>
					<div class="form-check mt-3 mb-3">
						<input v-model= "stepSeven.ready" class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
						<label class="form-check-label form-label fw-bolder fs-6" for="flexCheckDefault" style="font-weight: bold;">
							I am ready to launch my townhall in the Superwarden World!
						</label>
					</div>
					
					<div>
						<button type=" " class="btn btn-default float-start mt-3 ps-0" @click="prevStep"><b>&#8592; Back</b></button>
						<button type=" " class="btn btn-danger mt-3 ms-4 px-5" @click="checkCreation">Create</button>
					</div>
				</div>
				<div class="col-lg-5" style="position: relative;">
					<img src="../assets/superwarden.png" alt="" style="height: 50%; position: absolute; bottom: 0;">
				</div>
			</div>
		</div>
    <!-- </div> -->
	<div>

  </div>


<!-- Modal Region -->
	<div v-if="succeedCreationModalShow" class="modal" style="display:block;!important">
	<div class="modal-dialog" style="min-width: 600px;">
		<div class="modal-content">
		
		<div class="modal-body mt-3 p-5">
			<p class="modal-title text-center fs-4 text-dark fw-bolder">Townhall created successfully!</p>
			<div class="mb-3  mt-5 px-5 mx-5">
				<img class="" src="../assets/townhall-complete.png" style="width: 100%;"/>
			</div>
			<div class="mb-1 mt-5">
				<label class="form-label fw-bolder" style="color: #959595;">What you can do now?</label>
			</div>
			<p class="py-2 ps-2 border border-secondary fw-bolder" style="color: #959595; width: 100%; display: flex;"><img class="me-2" src="../assets/check.png" style="width: 25px;"/> Create and publish your first proposal</p>
				<p class="py-2 ps-2 border border-secondary fw-bolder" style="color: #959595; width: 100%;  display: flex;"><img class="me-2" src="../assets/check.png" style="width: 25px;"/> Broadcast your first townhall announcement</p>
		
				<p class="ps-2 py-2 border border-secondary fw-bolder" style="color: #959595; width: 100%;  display: flex;"><img class="me-2" src="../assets/check.png" style="width: 25px;"/> Invite your community to join the townhall</p>


			<button @click="backToHome" type="button" class="btn btn-danger text-center" style="width: 100%;">Back to World</button>
		</div>

		</div>
	</div>
	</div>
    <div  v-if="succeedCreationModalShow" class="modal-backdrop fade show"></div>
<!-- Modal Region -->


</template>
<script>
import Multiselect from '@vueform/multiselect'
import axios from 'axios';

// import console from 'console';
export default {
    name: "Setup",
	components: { Multiselect},
    data() {
        return {
			succeedCreationModalShow: false,
			disableCreation: false,
			 value: [],
			filename: '',
			categories : ['Media', 'Social', 'Entertainment', 'Protocol', 'Investment', 'Collectors', 'Grant', 'Art and Culture', 
			'Education', 'Research', 'Creator', 'Service'],
			steps: 1,
			stepOne: {
				name: '',
				categories: [],
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
				mtr_status : true, 
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
			stepSeven: {
				role: false,
				oneTownhall: false,
				ready: false
			},
			validation: { 
                invalid: {},
                valid: {},},
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

    created() {
    },
    mounted() {
        
    },
    methods: {
		async validateFirstStep(){
			let err = false
			if (!this.tempName) {
                this.validation.invalid.name = 'Please type the name of your townhall.';
                err = true
            } else {
				const response = await axios.get('https://superwarden.org/api/v1/search/slugName'+'?s='+this.tempName);
				if (response.data.count > 0){
					this.validation.invalid.name = 'This name is already taken.';
					err = true
				}
				this.stepOne.name = this.tempName
                this.validation.valid.name = 'The name of townhall is valid';
            }
			if (this.stepOne.categories.length < 2) {
                this.validation.invalid.categories = 'Choose 2 categories that best describe your townhall';
                err = true
            } else {
                this.validation.valid.categories = 'The category of townhall is valid';
            }
			if (!this.stepOne.bio) {
                this.validation.invalid.bio = 'Please type the bio of your townhall.';
                err = true
            } else {
                this.validation.valid.bio = 'The bio of townhall is valid';
            }
			if (!this.tempAvatar) {
                this.validation.invalid.avatar = 'Please type the url of your townhall avatar.';
                err = true
            } else {
				let url = await this.checkImageURL(this.tempAvatar)
				if (!url){
					this.validation.invalid.avatar = 'An invalid avatar url';
					err = true
				} else {

					this.stepOne.avatar = url
					this.validation.valid.avatar = 'The url of avatar is valid';
				}
            }
			if (!this.tempCoverPhoto) {
                this.validation.invalid.coverPhoto = 'Please type the url of your cover photo.';
                err = true
            } else {
				let url = await this.checkImageURL(this.tempCoverPhoto)
				if (!url){
					this.validation.invalid.coverPhoto = 'An invalid photo url';
					err = true
				} else {

					this.stepOne.coverPhoto = url
					this.validation.valid.coverPhoto = 'The url of cover photo is valid';
				}
            }
			if (!this.tempSlug) {
                this.validation.invalid.slug = 'Please type the slug of your townhall.';
                err = true
            } else {
				let string = this.tempSlug.replace(/\s+/g, '').trim().toLowerCase() + ".tron";
				let pass = false
				const response = await axios.get('https://superwarden.org/api/v1/search/slugName'+'?s='+string);
				// console.log(response)
				if (response.data.count == 0)
					pass = true
				else
					pass = false
				if (!pass){
					this.validation.invalid.slug = 'This slug is already taken.';
					err = true
				} else {
					this.stepOne.slug = string
					this.validation.valid.slug = 'The slug of your townhall is valid';
				}
			}
			if (err)
					return
			this.steps = 2
			this.resetValidation()

		},

		async validateSecondStep(){
			if (!this.stepTwo.twitter){
				this.validation.invalid.twitter = 'Please type the url of your twitter.';
                return
            } else {
                this.validation.valid.twitter = 'The url of your twitter is added.';
            }
			if (!this.stepTwo.discord){
				this.validation.invalid.discord = 'Please type the url of your discord.';
                return
            } else {
                this.validation.valid.discord = 'The url of your discord is added.';
            }
			if (!this.stepTwo.github){
				this.validation.invalid.github = 'Please type the url of your github.';
                return
            } else {
                this.validation.valid.github = 'The url of your github is added.';
            }
			if (!this.stepTwo.forum){
				this.validation.invalid.forum = 'Please type the url of your forum.';
                return
            } else {
                this.validation.valid.forum = 'The url of your forum is added.';
            }
			if (!this.stepTwo.details){
				this.validation.invalid.details = 'Please insert md file for details.';
                return
            } else {
                this.validation.valid.details = 'The md file is loaded.';
            }
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








			this.steps = 3
			this.resetValidation()
		},





		
		validateThirdStep(){
			if (!this.stepThree.webThrKey){
				this.validation.invalid.webThrKey = 'Please type the API key of your web3.storage.';
                return
            } else {
                this.validation.valid.webThrKey = 'The API key of your web3.storage is added.';
            }
			this.steps = 4
			this.resetValidation()
		},
		validateFourthStep(){
			this.steps = 5
			this.resetValidation()
		},
		validateFifthStep(){
			this.steps = 6
			this.resetValidation()
		},
		validateSixthStep(){
			if (this.stepSix.threshold.status){
				if (!this.stepSix.threshold.tk_symbol){
					this.validation.invalid.tk_symbol = 'Please type the symbol of your threshold.';
					return
				} else {
					this.validation.valid.tk_symbol = 'The symbol of your threshold is added.';
				}
				if (!this.stepSix.threshold.tk_addr){
					this.validation.invalid.tk_addr = 'Please type the address of your threshold.';
					return
				} else {
					this.validation.valid.tk_addr = 'The address of your threshold is added.';
				}
				if (!this.stepSix.threshold.threshold){
					this.validation.invalid.threshold = 'Please type the threshold of your threshold.';
					return
				} else {
					if (parseInt(this.stepSix.threshold.threshold) < 0){
						this.validation.invalid.threshold = "The threshold can not be less than 0."
					}
					this.validation.valid.threshold = 'The threshold of your threshold is added.';
				}
            }
			if (this.stepSix.tcr.status){
				if (!this.stepSix.tcr.tk_symbol){
					this.validation.invalid.tcr_tk_symbol = 'Please type the symbol of your TRC721.';
					return
				} else {
					this.validation.valid.tcr_tk_symbol = 'The symbol of your TRC721 is added.';
				}
				if (!this.stepSix.tcr.tk_addr){
					this.validation.invalid.tcr_tk_addr = 'Please type the address of your TRC721.';
					return
				} else {
					this.validation.valid.tcr_tk_addr = 'The address of your TRC721 is added.';
				}
			}
			this.steps = 7
			this.resetValidation()
		},
	





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









		async backToHome(){
			await this.$parent.$parent.getAccountData()
			// console.log(this)
			this.$router.push('/')
		},
		//#region validation part
		checkCategoryNumber(){
			// console.log(this.stepOne.categories)
			if (this.stepOne.categories.length > 2){
				this.stepOne.categories = this.stepOne.categories.slice(0,2)
				return
			}
		},
		nextStep(){
			console.log(this.stepOne)
			this.steps +=1
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
		checkCreation(){
			let pass = true
			for (var i = 0 ; i < 3; i++) {
				if (!this.stepSeven[Object.keys(this.stepSeven)[i]]){
					pass = false
				}
			}
			if (pass){
				let data = Object.assign(this.stepOne, this.stepTwo, this.stepThree, this.stepFour, this.stepFive, this.stepSix);
				api.createTownHall({_addr: this.$store.getters._addr, data: data}, (res =>{
					if (res){
						this.succeedCreationModalShow = true
					}
				}), err => {
					console.log(err)
				})
				// this.createTownhallModalShow = true
			}

		},
		createTownHall(){
			
			let data = Object.assign(this.stepOne, this.stepTwo, this.stepThree, this.stepFour, this.stepFive, this.stepSix);
			api.createTownHall({_addr: this.$store.getters._addr, data: data}, (res =>{
				if (res){
					this.succeedCreationModalShow = true
				}
			}), err => {
				console.log(err)
			})
		},

		prevStep(){
			console.log(this.stepThree)
			this.steps -=1
		},
		    change(val) {
				console.log(val)
				console.log(this.search)
    },
    }
}
</script>
<style src="@vueform/multiselect/themes/default.css"></style>
<style>



 
 
 
 
 
 
 
 
 
 </style>

