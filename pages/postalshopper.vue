<template>
  <div class="cb-page cb-postalshopper-page" :style="themeStyles" :class="{ 'cb-page--ready': !isBootLoading }">
    <transition name="cb-page-loader">
      <div v-if="isBootLoading" class="cb-page-loading-line" aria-live="polite" aria-busy="true">
        <span />
      </div>
    </transition>

    <div v-if="isBootLoading" class="cb-header-skeleton" aria-hidden="true">
      <div class="cb-shell cb-header-skeleton__top">
        <div class="cb-header-skeleton__meta">
          <span class="cb-skeleton cb-skeleton--meta cb-skeleton--wave" />
          <span class="cb-skeleton cb-skeleton--meta cb-skeleton--shorter cb-skeleton--wave" />
          <span class="cb-skeleton cb-skeleton--meta cb-skeleton--tiny cb-skeleton--wave" />
        </div>
        <div class="cb-header-skeleton__meta cb-header-skeleton__meta--right">
          <span class="cb-skeleton cb-skeleton--meta cb-skeleton--shorter cb-skeleton--wave" />
          <span class="cb-skeleton cb-skeleton--meta cb-skeleton--tiny cb-skeleton--wave" />
        </div>
      </div>
      <div class="cb-shell cb-header-skeleton__main">
        <div class="cb-skeleton cb-skeleton--logo cb-skeleton--wave" />
        <div class="cb-header-skeleton__nav">
          <span class="cb-skeleton cb-skeleton--nav cb-skeleton--wave" />
          <span class="cb-skeleton cb-skeleton--nav cb-skeleton--wave" />
          <span class="cb-skeleton cb-skeleton--nav cb-skeleton--shorter cb-skeleton--wave" />
        </div>
        <div class="cb-header-skeleton__actions">
          <span class="cb-skeleton cb-skeleton--search cb-skeleton--wave" />
          <span class="cb-skeleton cb-skeleton--menu cb-skeleton--wave" />
        </div>
      </div>
    </div>

    <HomeHeader v-if="!isBootLoading" :logo-url="logoUrl" :icons="icons" :content="headerSettings" :links="headerLinks" />

    <main v-if="!isBootLoading" class="cb-page__content cb-postalshopper">
      <section v-if="sectionEnabled('postalshopper_hero')" id="postalshopper-hero" class="cb-ps-hero" :style="heroStyles">
        <div class="cb-shell cb-ps-hero__grid">
          <article class="cb-ps-hero__copy">
            <div v-if="heroSettings.badge" class="cb-ps-hero__badge">
              <span class="cb-ps-hero__badge-dot"></span>
              {{ heroSettings.badge }}
            </div>

            <h1>
              <span v-for="(row, index) in heroTitleRows" :key="`ps-hero-row-${index}`">
                <strong v-if="row.white">{{ row.white }}</strong>
                <em v-if="row.yellow">{{ row.yellow }}</em>
              </span>
            </h1>

            <p
              v-for="(paragraph, index) in heroParagraphs"
              :key="`ps-hero-paragraph-${index}`"
              :class="paragraph.style === 'lead' ? 'cb-ps-hero__lead' : 'cb-ps-hero__subtitle'"
            >{{ paragraph.text }}</p>

            <div v-if="heroSettings.primary_button_label || heroSettings.primary_button_url || heroSettings.secondary_button_label || heroSettings.secondary_button_url" class="cb-ps-hero__actions">
              <button
                v-if="(heroSettings.primary_button_label || heroSettings.primary_button_url) && tutorialLink"
                type="button"
                class="cb-ps-btn cb-ps-btn--primary"
                @click="openTutorialModal"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M8 5.7c0-.8.9-1.3 1.6-.9l10 6.3a1 1 0 0 1 0 1.7l-10 6.3c-.7.4-1.6-.1-1.6-.9V5.7Z" />
                </svg>
                <span>{{ primaryButtonLabel }}</span>
              </button>
              <a
                v-else-if="heroSettings.primary_button_label || heroSettings.primary_button_url"
                class="cb-ps-btn cb-ps-btn--primary"
                href="#postalshopper-steps"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M8 5.7c0-.8.9-1.3 1.6-.9l10 6.3a1 1 0 0 1 0 1.7l-10 6.3c-.7.4-1.6-.1-1.6-.9V5.7Z" />
                </svg>
                <span>{{ primaryButtonLabel }}</span>
              </a>
              <a
                v-if="heroSettings.secondary_button_label || secondaryButtonUrl"
                class="cb-ps-btn cb-ps-btn--secondary"
                :href="secondaryButtonUrl || '#postalshopper-steps'"
                :target="linkTarget(secondaryButtonUrl)"
                :rel="linkRel(secondaryButtonUrl)"
              >
                <span>{{ heroSettings.secondary_button_label || 'Más información' }}</span>
              </a>
            </div>

            <div v-if="heroFeatureItems.length" class="cb-ps-hero__stats">
              <article v-for="(item, index) in heroFeatureItems" :key="item.id || item.value || index" class="cb-ps-hero__stat">
                <span class="cb-ps-hero__stat-icon" v-html="icons.star"></span>
                <strong>{{ item.value }}</strong>
                <small>{{ item.label }}</small>
              </article>
            </div>
          </article>

        </div>
        <div class="cb-ps-hero__wave" aria-hidden="true">
          <svg viewBox="0 0 1440 110" preserveAspectRatio="none" role="presentation">
            <path d="M0,62 C170,38 322,70 498,54 C650,40 802,35 965,45 C1126,55 1274,66 1440,48 L1440,110 L0,110 Z" />
          </svg>
        </div>
      </section>

      <section
        v-if="sectionEnabled('postalshopper_destinations') && (availableDestinationItems.length || hasUpcomingDestinations)"
        class="cb-ps-destinations cb-ps-destinations--service-links"
        aria-label="Disponibilidad de envíos Postal Shopper"
      >
        <div class="cb-ps-destinations__grid">
          <component
            v-for="(item, index) in availableDestinationItems"
            :key="item.id || item.label || index"
            :is="destinationCardComponent(item)"
            v-bind="destinationCardAttributes(item)"
            class="cb-ps-destination-card"
            :class="{
              'cb-ps-destination-card--linked': item.url,
              'cb-ps-destination-card--available': isDestinationAvailable(item.status)
            }"
            :aria-label="destinationCardAriaLabel(item)"
            :aria-disabled="!item.url || null"
          >
            <span
              class="cb-ps-destination-card__flag"
              :class="{ 'cb-ps-destination-card__flag--us': destinationFlagImage(item.flag) === '/flags/us.svg' }"
              aria-hidden="true"
            >
              <img v-if="destinationFlagImage(item.flag)" :src="destinationFlagImage(item.flag)" alt="" loading="lazy" decoding="async">
              <span v-else-if="item.flag && item.flag !== '🌐'">{{ item.flag }}</span>
              <span v-else class="cb-ps-destination-card__globe" v-html="icons.globe"></span>
            </span>
            <span class="cb-ps-destination-card__copy">
              <strong>{{ item.label }}</strong>
              <small :class="destinationStatusClass(item.status)">
                <span aria-hidden="true"></span>
                {{ item.status || 'Próximamente' }}
              </small>
            </span>
            <span v-if="item.url" class="cb-ps-destination-card__arrow" aria-hidden="true">↗</span>
          </component>

          <article
            v-if="hasUpcomingDestinations"
            class="cb-ps-destination-card cb-ps-destination-card--upcoming"
            :aria-label="`${destinationSettings.upcoming_label || 'Nuevos envíos'}: ${destinationSettings.upcoming_status || 'Muy pronto'}`"
          >
            <span class="cb-ps-destination-card__flag cb-ps-destination-card__flag--upcoming" aria-hidden="true">
              <img src="/flags/globe.svg" alt="" loading="lazy" decoding="async">
              <span class="cb-ps-upcoming-flag__mark">?</span>
            </span>
            <span class="cb-ps-destination-card__copy">
              <strong>{{ destinationSettings.upcoming_label || 'Nuevos envíos' }}</strong>
              <small class="cb-ps-destination-card__status">
                <span aria-hidden="true"></span>
                {{ destinationSettings.upcoming_status || 'Muy pronto' }}
              </small>
            </span>
          </article>
        </div>
      </section>

      <section v-if="sectionEnabled('postalshopper_steps')" id="postalshopper-steps" class="cb-ps-steps">
        <div class="cb-shell">
          <div class="cb-ps-heading cb-ps-heading--center">
            <div class="cb-ps-heading__accent"></div>
            <h2>{{ stepsSettings.title || '¿Cómo funciona Postal Shopper?' }}</h2>
            <p v-if="stepsSettings.subtitle">{{ stepsSettings.subtitle }}</p>
          </div>

          <div class="cb-ps-steps__grid">
            <div class="cb-ps-steps__cards">
              <article v-for="(item, index) in stepItems" :key="item.id || item.title || index" class="cb-ps-step-card">
                <span class="cb-ps-step-card__icon" aria-hidden="true" v-html="resolveIcon(item.icon || 'package')"></span>
                <span class="cb-ps-step-card__copy">
                  <h3><span>{{ item.step || index + 1 }}.</span> {{ item.title }}</h3>
                  <p v-if="item.text">{{ item.text }}</p>
                </span>
              </article>
            </div>

            <component
              :is="tutorialLink ? 'button' : 'article'"
              v-if="stepsSettings.tutorial_label || stepsSettings.tutorial_image || tutorialLink"
              id="postalshopper-tutorial"
              class="cb-ps-tutorial-card"
              :type="tutorialLink ? 'button' : null"
              @click="tutorialLink ? openTutorialModal($event) : null"
              :aria-label="`${stepsSettings.tutorial_label || 'Ver tutorial completo de Postal Shopper'}${stepsSettings.tutorial_duration ? ', duración ' + stepsSettings.tutorial_duration : ''}`"
            >
              <span class="cb-ps-tutorial-card__city" aria-hidden="true">
                <svg viewBox="0 0 480 180" preserveAspectRatio="none">
                  <path d="M0 180V112h35V90h18v22h24V61h35v51h18V77h34v35h19V43h43v69h22V84h34v28h17V60h41v52h21V94h28v18h27V72h34v40h30v68H0Z" fill="currentColor" />
                </svg>
              </span>
              <img :src="stepsSettings.tutorial_image || '/postalshopper-calculator-mascot.png'" alt="" loading="lazy" decoding="async">
              <span class="cb-ps-tutorial-card__play" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5.7c0-.8.9-1.3 1.6-.9l10 6.3a1 1 0 0 1 0 1.7l-10 6.3c-.7.4-1.6-.1-1.6-.9V5.7Z" />
                </svg>
              </span>
              <span class="cb-ps-tutorial-card__label">{{ stepsSettings.tutorial_label || 'Ver tutorial completo' }} <span v-if="stepsSettings.tutorial_duration">· {{ stepsSettings.tutorial_duration }}</span></span>
            </component>
          </div>

        </div>
      </section>

      <section v-if="sectionEnabled('postalshopper_calculator')" id="postalshopper-calculadora" class="cb-ps-calculator" aria-labelledby="postalshopper-calculator-title">
        <div class="cb-shell">
          <div class="cb-ps-calculator__grid">
            <figure class="cb-ps-calculator__visual">
              <img :src="calculatorSettings.image || '/postalshopper-calculator-mascot.png'" :alt="calculatorSettings.image_alt || 'Cartero con un paquete y una calculadora de envíos'" loading="lazy" decoding="async">
              <figcaption class="cb-ps-calculator__visual-caption">
                <span class="cb-ps-calculator__caption-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8" />
                    <path d="M12 11v5m0-8h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                  </svg>
                </span>
                <span class="cb-ps-calculator__caption-copy">
                  <small>{{ calculatorSettings.caption_label || 'POSTAL SHOPPER' }}</small>
                  <strong>{{ calculatorSettings.caption_notice || 'Acompañamos cada envío hasta Bolivia.' }}</strong>
                  <span>{{ calculatorSettings.caption_text || 'Tus compras, de Miami a Bolivia' }}</span>
                </span>
              </figcaption>
            </figure>
            <article class="cb-ps-calculator__card" :aria-label="calculatorSettings.calculator_aria_label || 'Calculadora de tarifa Postal Shopper'">
              <div class="cb-ps-flow">
                <ol class="cb-ps-flow__progress" :aria-label="calculatorSettings.progress_label || 'Pasos de la cotización'">
                  <li v-for="(step, index) in calculatorStepLabels" :key="step" :aria-current="calculatorStep === index + 1 ? 'step' : null" :class="{ 'is-current': calculatorStep === index + 1, 'is-complete': calculatorStep > index + 1 }">
                    <span class="cb-ps-flow__step-number">{{ index + 1 }}</span><small>{{ step }}</small>
                    <span v-if="index < calculatorStepLabels.length - 1" class="cb-ps-flow__step-connector" aria-hidden="true"></span>
                  </li>
                </ol>
                <header class="cb-ps-flow__step-heading cb-ps-flow__step-heading--with-notes" :class="{ 'cb-ps-flow__step-heading--weight': calculatorStep === 2 }">
                  <span class="cb-ps-flow__step-heading-icon" aria-hidden="true">
                    <svg viewBox="0 0 48 48" fill="none"><path d="m24 5 17 9.3v19.4L24 43 7 33.7V14.3L24 5Z" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><path d="m7.8 14.8 16.2 9 16.2-9M24 23.8V42m-7.2-33 16.5 9" stroke="currentColor" stroke-width="2.7" stroke-linejoin="round"/></svg>
                  </span>
                  <span class="cb-ps-flow__step-heading-copy">
                    <h2 id="postalshopper-calculator-title">{{ calculatorCurrentHeading.title }}<em v-if="calculatorCurrentHeading.accent"> {{ calculatorCurrentHeading.accent }}</em></h2>
                    <p>{{ calculatorCurrentHeading.subtitle }}</p>
                  </span>
                  <aside class="cb-ps-flow__quote-notes" aria-label="Información del envío">
                    <p class="cb-ps-flow__quote-note cb-ps-flow__quote-note--delivery">
                      <span class="cb-ps-flow__quote-note-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.7"/><path d="M12 7v5l3 2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
                      <span class="cb-ps-flow__quote-note-copy"><strong>{{ quoteNoteTitle(calculatorSettings.delivery_estimate_notice, 'Tiempo estimado de entrega') }}</strong><span>{{ quoteNoteBody(calculatorSettings.delivery_estimate_notice, 'Tiempo estimado de entrega: 15 días a partir del pago de su envío.') }}</span></span>
                    </p>
                    <p class="cb-ps-flow__quote-note cb-ps-flow__quote-note--customs">
                      <span class="cb-ps-flow__quote-note-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M12 3 20 6v5c0 5-3.5 8.2-8 10-4.5-1.8-8-5-8-10V6l8-3Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M9 12h6m-5-3h4m-4 6h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></span>
                      <span class="cb-ps-flow__quote-note-copy"><strong>{{ quoteNoteTitle(calculatorSettings.customs_notice, 'Tributos aduaneros') }}</strong><span>{{ quoteNoteBody(calculatorSettings.customs_notice, 'La tarifa no incluye tributos aduaneros, que se liquidan conforme a normativa vigente.') }}</span></span>
                    </p>
                  </aside>
                </header>

                <transition name="cb-ps-step" mode="out-in">
                <section v-if="calculatorStep === 1" class="cb-ps-flow__panel" aria-labelledby="postalshopper-calculator-title">
                  <p v-if="tariffCategories.length && !hasOfficialProductCategories" class="cb-ps-flow__notice cb-ps-flow__notice--soft">
                    <span aria-hidden="true">i</span>
                    {{ calculatorSettings.unclassified_notice || 'Estas opciones son orientativas y no representan categorías oficiales ni determinan una tarifa. La clasificación, admisión y costo se confirman con el proveedor.' }}
                  </p>

                  <p v-if="!tariffCategories.length" class="cb-ps-flow__empty-selection">{{ calculatorSettings.empty_categories_label || 'No hay categorías disponibles en este momento.' }}</p>
                  <div v-else ref="categoryScroller" class="cb-ps-flow__category-scroller" role="group" tabindex="0" :aria-label="calculatorSettings.category_picker_label || 'Elige uno o varios tipos de producto'">
                    <div class="cb-ps-flow__category-grid">
                      <button
                        v-for="category in tariffCategories"
                        :key="category.key"
                        type="button"
                        class="cb-ps-flow__category-choice"
                        :class="{ 'is-selected': isProductCategorySelected(category.key) }"
                        :aria-pressed="isProductCategorySelected(category.key)"
                        @click="selectProductCategory(category.key)"
                      >
                        <span class="cb-ps-flow__category-art" :class="`cb-ps-flow__category-art--${category.icon || 'package'}`" aria-hidden="true">
                          <img v-if="category.image" :src="category.image" alt="" loading="lazy" decoding="async">
                          <span v-else v-html="categoryIllustration(category)"></span>
                        </span>
                        <strong>{{ category.label }}</strong>
                        <span v-if="categoryDetails(category.key)" class="cb-ps-flow__category-note">{{ categoryDetails(category.key) }}</span>
                        <span v-if="isProductCategorySelected(category.key)" class="cb-ps-flow__category-check" aria-hidden="true">✓</span>
                      </button>
                    </div>
                  </div>
                  <p v-if="categoryStripHasOverflow" class="cb-ps-flow__scroll-hint">Desliza para ver más categorías <span aria-hidden="true">→</span></p>

                  <div v-if="parcelProducts.length" class="cb-ps-flow__selected-list" :aria-label="calculatorSettings.selected_products_label || 'Productos seleccionados'">
                    <article v-for="product in parcelProducts" :key="product.id" class="cb-ps-flow__selected-product">
                      <span class="cb-ps-flow__selected-icon" aria-hidden="true">
                        <img v-if="selectedProductCategory(product.categoryKey)?.image" :src="selectedProductCategory(product.categoryKey).image" alt="" loading="lazy" decoding="async">
                        <span v-else v-html="categoryIllustration(selectedProductCategory(product.categoryKey))"></span>
                      </span>
                      <span class="cb-ps-flow__selected-copy">
                        <strong>{{ productDisplayName(product) }}</strong>
                        <small v-if="!product.categoryKey">{{ calculatorSettings.missing_category_label || 'Elige una categoría arriba para este producto.' }}</small>
                        <small v-else-if="categoryDetails(product.categoryKey)">{{ categoryDetails(product.categoryKey) }}</small>
                      </span>
                      <span class="cb-ps-flow__selected-value">
                        <label :for="'postalshopper-value-' + product.id" class="cb-ps-flow__weight-label">Valor de compra (USD)</label>
                        <label class="cb-ps-flow__weight-input" :class="{ 'is-invalid': shouldShowDeclaredValueError(product) }">
                          <span class="cb-ps-flow__sr-only">Valor de compra en USD de {{ productDisplayName(product) }}</span>
                          <input :id="'postalshopper-value-' + product.id" v-model.number="product.declaredValueUsd" type="number" min="0.01" step="0.01" inputmode="decimal" required :aria-invalid="!isProductDeclaredValueValid(product)" :aria-describedby="shouldShowDeclaredValueError(product) ? 'postalshopper-value-error-' + product.id : null" @blur="markDeclaredValueTouched(product.id)">
                          <span>USD</span>
                        </label>
                        <small v-if="shouldShowDeclaredValueError(product)" :id="'postalshopper-value-error-' + product.id" class="cb-ps-flow__field-error" role="status">{{ declaredValueErrorMessage(product) }}</small>
                        <small v-else-if="!product.declaredValueUsd" class="cb-ps-flow__field-help">Ingresa el valor pagado de este producto.</small>
                      </span>
                      <button type="button" class="cb-ps-flow__remove-icon" :aria-label="(calculatorSettings.remove_product_label || 'Quitar') + ' ' + productDisplayName(product)" @click="removeParcelProduct(product.id)">×</button>
                    </article>
                  </div>
                  <div v-if="parcelProducts.length" class="cb-ps-flow__declared-total" :class="{ 'is-invalid': shipmentValueExceeded }" aria-live="polite"><span>Valor total de productos<small>Máximo por envío: USD {{ formatLimitAmount(maxShipmentValueUsd) }}. La suma se actualiza al editar cada producto.</small></span><strong>USD {{ formatParcelPrice(totalDeclaredValueUsd) }}</strong></div>
                  <p v-if="shipmentValueExceeded" class="cb-ps-flow__limit-error" role="alert">El valor de los productos de un envío no puede superar USD {{ formatLimitAmount(maxShipmentValueUsd) }}. Retire productos o divídalos en otro envío.</p>
                  <p v-if="!parcelProducts.length && tariffCategories.length" class="cb-ps-flow__empty-selection">{{ calculatorSettings.empty_selection_label || 'Selecciona una o varias categorías para armar tu compra.' }}</p>

                  <div class="cb-ps-flow__actions cb-ps-flow__actions--end">
                    <button type="button" class="cb-ps-flow__button cb-ps-flow__button--primary" :disabled="!declaredValuesAreValid" @click="calculatorStep = 2">{{ calculatorSettings.button_continue_weight || 'Continuar al peso' }} <span class="cb-ps-flow__button-arrow" aria-hidden="true">→</span></button>
                  </div>
                </section>

                <section v-else-if="calculatorStep === 2" class="cb-ps-flow__panel" aria-labelledby="postalshopper-calculator-title">
                  <div class="cb-ps-flow__weights">
                    <div v-for="product in parcelProducts" :key="product.id" class="cb-ps-flow__weight-row">
                      <div class="cb-ps-flow__weight-product">
                        <span class="cb-ps-flow__weight-product-icon" aria-hidden="true">
                          <img v-if="selectedProductCategory(product.categoryKey)?.image" :src="selectedProductCategory(product.categoryKey).image" alt="" loading="lazy" decoding="async">
                          <span v-else v-html="categoryIllustration(selectedProductCategory(product.categoryKey))"></span>
                        </span>
                        <span class="cb-ps-flow__weight-product-copy">
                          <strong>{{ productDisplayName(product) }}</strong>
                          <small>{{ productCategoryLabel(product.categoryKey) }}</small>
                          <span class="cb-ps-flow__product-unit-control">
                            <small class="cb-ps-flow__product-unit-caption">Máximo por producto: {{ formatParcelWeight(maxWeightForProduct(product)) }} {{ productWeightUnit(product) }}</small>
                            <span class="cb-ps-flow__product-unit" role="group" :aria-label="'Unidad de peso para ' + productDisplayName(product)">
                              <button type="button" :class="{ 'is-selected': productWeightUnit(product) === 'lb' }" :aria-pressed="productWeightUnit(product) === 'lb'" @click="setProductWeightUnit(product, 'lb')">lb</button>
                              <button type="button" :class="{ 'is-selected': productWeightUnit(product) === 'kg' }" :aria-pressed="productWeightUnit(product) === 'kg'" @click="setProductWeightUnit(product, 'kg')">kg</button>
                            </span>
                          </span>
                        </span>
                      </div>
                      <div class="cb-ps-flow__weight-control">
                        <div class="cb-ps-flow__weight-control-head">
                          <label class="cb-ps-flow__weight-label">Peso estimado ({{ productWeightUnit(product) }})</label>
                        </div>
                        <label class="cb-ps-flow__weight-input">
                          <span class="cb-ps-flow__sr-only">{{ calculatorSettings.weight_input_label || 'Peso de' }} {{ productDisplayName(product) }}</span>
                          <input v-model.number="product.weight" :class="{ 'is-invalid': shouldShowWeightError(product) }" type="number" min="0.01" :max="maxWeightForProduct(product)" step="0.01" inputmode="decimal" required :aria-invalid="!isProductWeightValid(product)" :aria-describedby="shouldShowWeightError(product) ? 'postalshopper-weight-error-' + product.id : null" @blur="markWeightTouched(product.id)">
                          <span>{{ weightUnit(product) }}</span>
                        </label>
                        <small v-if="shouldShowWeightError(product)" :id="'postalshopper-weight-error-' + product.id" class="cb-ps-flow__field-error" role="status">{{ productWeightErrorMessage(product) }}</small>
                      </div>
                    </div>
                  </div>
                  <div class="cb-ps-flow__weight-total" :class="{ 'is-invalid': shipmentWeightExceeded }"><span class="cb-ps-flow__weight-total-label">{{ calculatorSettings.weight_total_label || 'Peso total del envío' }}<small>Máximo total: {{ formatParcelWeight(maxShipmentWeightKg) }} kg. El límite por producto es {{ formatParcelWeight(maxWeightKg) }} kg o {{ formatParcelWeight(maxWeightPounds) }} lb.</small></span><strong>{{ formatParcelWeight(totalParcelWeightPounds) }} <small>lb</small><small>≈ {{ formatParcelWeight(totalParcelWeightKg) }} kg</small></strong></div>
                  <p v-if="shipmentWeightExceeded" class="cb-ps-flow__limit-error" role="alert">El peso de un envío no puede superar {{ formatParcelWeight(maxShipmentWeightKg) }} kg. Retire productos o divídalos en otro envío.</p>
                  <div class="cb-ps-flow__declared-total" :class="{ 'is-invalid': shipmentValueExceeded }" aria-live="polite"><span>Valor total de productos<small>La suma se actualiza al ingresar el valor de cada artículo.</small></span><strong>USD {{ formatParcelPrice(totalDeclaredValueUsd) }}</strong></div>
                  <p v-if="shipmentValueExceeded" class="cb-ps-flow__limit-error" role="alert">El valor de los productos de un envío no puede superar USD {{ formatLimitAmount(maxShipmentValueUsd) }}. Retire productos o divídalos en otro envío.</p>
                  <div class="cb-ps-flow__actions">
                    <button type="button" class="cb-ps-flow__button cb-ps-flow__button--secondary" @click="calculatorStep = 1"><span class="cb-ps-flow__button-leading" aria-hidden="true">←</span>{{ calculatorSettings.button_edit_products || 'Editar productos' }}</button>
                    <button type="button" class="cb-ps-flow__button cb-ps-flow__button--primary" :disabled="!quoteInputsAreValid" @click="continueToQuote">{{ calculatorSettings.button_continue_quote || 'Ver cotización' }} <span class="cb-ps-flow__button-arrow" aria-hidden="true">→</span></button>
                  </div>
                </section>

                <section v-else class="cb-ps-flow__panel" aria-labelledby="postalshopper-calculator-title">
                  <div class="cb-ps-flow__summary">
                    <div v-for="product in parcelProducts" :key="product.id" class="cb-ps-flow__summary-row">
                      <span class="cb-ps-flow__summary-icon" aria-hidden="true">
                        <img v-if="selectedProductCategory(product.categoryKey)?.image" :src="selectedProductCategory(product.categoryKey).image" alt="" loading="lazy" decoding="async">
                        <svg v-else viewBox="0 0 24 24" fill="none"><path d="m12 2 8 4.5v11L12 22 4 17.5v-11L12 2Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M12 22V11m8-4.5-8 4.5-8-4.5" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>
                      </span>
                      <span class="cb-ps-flow__summary-copy"><strong>{{ productDisplayName(product) }}</strong><small>{{ productCategoryLabel(product.categoryKey) }} · USD {{ formatParcelPrice(product.declaredValueUsd) }}</small></span>
                      <strong class="cb-ps-flow__summary-weight">{{ formatParcelWeight(product.weight) }} {{ productWeightUnit(product) }}</strong>
                    </div>
                    <div class="cb-ps-flow__summary-mode"><span class="cb-ps-flow__summary-mode-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M3 7h18M7 3v4m10-4v4M5 7v13h14V7M8 11h8m-8 4h5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg></span><span>{{ calculatorSettings.postal_modality_label || 'Modalidad de envío: Postal a Postal' }}</span></div>
                    <div class="cb-ps-flow__summary-total"><span>{{ calculatorSettings.quote_weight_total_label || calculatorSettings.weight_total_label || 'Peso total del envío' }}</span><strong>{{ formatParcelWeight(totalParcelWeightPounds) }} lb (≈ {{ formatParcelWeight(totalParcelWeightKg) }} kg)</strong></div>
                    <div class="cb-ps-flow__summary-total cb-ps-flow__summary-total--declared"><span>Valor total de productos</span><strong>USD {{ formatParcelPrice(totalDeclaredValueUsd) }}</strong></div>
                  </div>

                  <div v-if="weightTariffQuote" class="cb-ps-flow__price-card" aria-live="polite">
                    <div v-if="weightTariffQuote.extra_weight === 0" class="cb-ps-flow__price-line">
                      <span>{{ calculatorSettings.quote_applied_label || 'Tarifa aplicada hasta' }} {{ weightTariffQuote.billable_weight }} lb</span>
                      <strong>{{ weightTariffQuote.currency }} {{ formatParcelPrice(weightTariffQuote.base_price) }}</strong>
                    </div>
                    <template v-else>
                      <div class="cb-ps-flow__price-line"><span>{{ calculatorSettings.quote_base_label || 'Tarifa base para' }} {{ weightTariffQuote.base_weight }} lb</span><strong>{{ weightTariffQuote.currency }} {{ formatParcelPrice(weightTariffQuote.base_price) }}</strong></div>
                      <div class="cb-ps-flow__price-line cb-ps-flow__price-line--extra"><span>{{ calculatorSettings.quote_excess_label || 'Peso excedente' }}: {{ formatParcelWeight(weightTariffQuote.extra_weight) }} lb × {{ weightTariffQuote.currency }} {{ formatParcelPrice(weightTariffQuote.extra_rate) }}/lb</span><strong>{{ weightTariffQuote.currency }} {{ formatParcelPrice(weightTariffQuote.extra_price) }}</strong></div>
                    </template>
                    <div class="cb-ps-flow__price-total">
                      <span>{{ calculatorSettings.total_label || 'Tarifa estimada' }}</span>
                      <span class="cb-ps-flow__price-total-values">
                        <strong v-if="quoteShippingPriceBs !== null">Bs {{ formatParcelPrice(quoteShippingPriceBs) }}</strong>
                        <strong v-else>{{ weightTariffQuote.currency }} {{ formatParcelPrice(weightTariffQuote.shipping_price) }}</strong>
                        <small>{{ weightTariffQuote.currency }} {{ formatParcelPrice(weightTariffQuote.shipping_price) }}<template v-if="quoteShippingPriceBs !== null"> · {{ calculatorSettings.usd_to_bob_rate_note || 'Tasa BCB de referencia' }}: 1 USD = Bs {{ formatExchangeRate(usdToBobRate) }}</template></small>
                      </span>
                    </div>
                  </div>
                  <div v-else class="cb-ps-flow__notice cb-ps-flow__notice--pending" role="status">
                    <span class="cb-ps-flow__pending-mark" aria-hidden="true">!</span>
                    <div><strong>{{ calculatorSettings.pending_quote_title || 'Cotización pendiente de confirmación' }}</strong><p>{{ totalParcelWeightPounds > maxWeightPounds ? 'El tarifario disponible llega hasta ' + formatParcelWeight(maxWeightPounds) + ' lb. Confirma el flete para este peso.' : calculatorSettings.pending_quote_message || 'No hay una tarifa cargada para el peso facturable indicado. Contacta a Correos para confirmar el costo.' }}</p></div>
                  </div>

                  <div class="cb-ps-flow__actions cb-ps-flow__actions--quote">
                    <button type="button" class="cb-ps-flow__button cb-ps-flow__button--secondary" @click="openProductEditor">{{ calculatorSettings.button_edit_products || 'Editar productos' }}</button>
                    <a class="cb-ps-flow__button cb-ps-flow__button--primary" :href="secondaryButtonUrl" :target="linkTarget(secondaryButtonUrl)" :rel="linkRel(secondaryButtonUrl)">{{ calculatorSettings.button_create_account || 'Crear mi casilla' }} <span class="cb-ps-flow__button-arrow" aria-hidden="true">→</span></a>
                  </div>
                </section>
                </transition>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section v-if="sectionEnabled('postalshopper_intro')" id="postalshopper-intro" class="cb-ps-intro">
        <div class="cb-shell cb-ps-intro__inner">
          <div class="cb-ps-heading cb-ps-heading--center">
            <div v-if="introSettings.eyebrow" class="cb-ps-heading__eyebrow">
              <span></span>
              <small>{{ introSettings.eyebrow }}</small>
              <span></span>
            </div>
            <h2 v-if="introSettings.title">{{ introSettings.title }}</h2>
            <p v-if="introSettings.paragraph_one" class="cb-ps-intro__lead">{{ introSettings.paragraph_one }}</p>
            <p v-if="introSettings.paragraph_two" class="cb-ps-intro__copy">{{ introSettings.paragraph_two }}</p>
          </div>

          <div v-if="marketChips.length" class="cb-ps-intro__brand-marquee" aria-label="Tiendas compatibles">
            <div class="cb-ps-intro__brand-track">
              <span
                v-for="(item, index) in marketMarqueeItems"
                :key="`${item.id || item.label || index}-${index}`"
                class="cb-ps-intro__brand"
              >
                <strong :class="brandLogoClass(item.label)">
                  <img
                    v-if="marketLogoUrl(item)"
                    :src="marketLogoUrl(item)"
                    :alt="`${item.label || 'Tienda'} logo`"
                    loading="lazy"
                    decoding="async"
                  >
                  <span v-else v-html="brandLogoSvg(item.label)"></span>
                </strong>
              </span>
            </div>
          </div>
        </div>
      </section>

      <section v-if="sectionEnabled('postalshopper_benefits')" id="postalshopper-benefits" class="cb-ps-benefits">
        <div class="cb-shell">
          <div class="cb-ps-heading cb-ps-heading--center cb-ps-heading--light">
            <div class="cb-ps-heading__accent"></div>
            <h2 v-if="benefitsSettings.title">{{ benefitsSettings.title }}</h2>
            <p v-if="benefitsSettings.subtitle">{{ benefitsSettings.subtitle }}</p>
          </div>

          <div class="cb-ps-benefits__grid">
            <article v-for="(item, index) in benefitItems" :key="item.id || item.title || index" class="cb-ps-benefit-card">
              <div class="cb-ps-benefit-card__icon" v-html="resolveIcon(item.icon || 'globe')"></div>
              <h3>{{ item.title }}</h3>
              <p>{{ item.text }}</p>
            </article>
          </div>

          <div v-if="benefitsSettings.banner_title || benefitsSettings.banner_text" class="cb-ps-benefits__banner">
            <div class="cb-ps-benefits__banner-icon" v-html="icons.package"></div>
            <div class="cb-ps-benefits__banner-copy">
              <h3 v-if="benefitsSettings.banner_title">{{ benefitsSettings.banner_title }}</h3>
              <p v-if="benefitsSettings.banner_text">{{ benefitsSettings.banner_text }}</p>
            </div>
            <a
              v-if="benefitsSettings.banner_button_label && benefitsSettings.banner_button_url"
              class="cb-ps-btn cb-ps-btn--banner"
              :href="benefitsSettings.banner_button_url"
              :target="linkTarget(benefitsSettings.banner_button_url)"
              :rel="linkRel(benefitsSettings.banner_button_url)"
            >{{ benefitsSettings.banner_button_label }}</a>
          </div>
        </div>
      </section>

    </main>

    <transition name="cb-ps-editor-modal">
        <div
          v-if="productEditorOpen"
          ref="productEditorModal"
          class="cb-ps-editor-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cb-ps-editor-title"
          tabindex="-1"
          @click.self="closeProductEditor"
        >
          <section class="cb-ps-editor-modal__dialog">
            <header class="cb-ps-editor-modal__header">
              <div class="cb-ps-editor-modal__heading">
                <span class="cb-ps-editor-modal__eyebrow">POSTAL SHOPPER · TU ENVÍO</span>
                <h2 id="cb-ps-editor-title">Editar productos</h2>
                <p>Agrega o quita productos y actualiza el peso y valor de compra de cada uno.</p>
              </div>
              <button ref="productEditorClose" type="button" class="cb-ps-editor-modal__close" aria-label="Cerrar edición" @click="closeProductEditor">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>
              </button>
            </header>

            <div class="cb-ps-editor-modal__body">
              <section class="cb-ps-editor-modal__section" aria-labelledby="cb-ps-editor-categories-title">
                <div class="cb-ps-editor-modal__section-heading">
                  <div><span class="cb-ps-editor-modal__step">1</span><h3 id="cb-ps-editor-categories-title">Agrega o quita productos</h3></div>
                  <small>Selecciona una o varias categorías</small>
                </div>
                <div v-if="tariffCategories.length" class="cb-ps-editor-modal__categories">
                  <button
                    v-for="category in tariffCategories"
                    :key="category.key"
                    type="button"
                    class="cb-ps-editor-modal__category"
                    :class="{ 'is-selected': isProductEditorCategorySelected(category.key) }"
                    :aria-pressed="isProductEditorCategorySelected(category.key)"
                    @click="toggleProductEditorCategory(category.key)"
                  >
                    <span class="cb-ps-editor-modal__category-image">
                      <img v-if="category.image" :src="category.image" alt="" loading="lazy" decoding="async">
                      <span v-else v-html="categoryIllustration(category)"></span>
                    </span>
                    <strong>{{ category.label }}</strong>
                    <small v-if="categoryDetails(category.key)">{{ categoryDetails(category.key) }}</small>
                    <span class="cb-ps-editor-modal__category-check" aria-hidden="true">{{ isProductEditorCategorySelected(category.key) ? '✓' : '+' }}</span>
                  </button>
                </div>
                <p v-else class="cb-ps-editor-modal__empty">No hay categorías disponibles.</p>
              </section>

              <section class="cb-ps-editor-modal__section" aria-labelledby="cb-ps-editor-list-title">
                  <div class="cb-ps-editor-modal__section-heading">
                  <div><span class="cb-ps-editor-modal__step">2</span><h3 id="cb-ps-editor-list-title">Productos, peso y valor</h3></div>
                  <small>{{ productEditorDraft.length }} {{ productEditorDraft.length === 1 ? 'producto' : 'productos' }}</small>
                </div>
                <div v-if="productEditorDraft.length" class="cb-ps-editor-modal__products">
                  <article v-for="product in productEditorDraft" :key="product.id" class="cb-ps-editor-modal__product">
                    <span class="cb-ps-editor-modal__product-icon" aria-hidden="true">
                      <img v-if="selectedProductCategory(product.categoryKey)?.image" :src="selectedProductCategory(product.categoryKey).image" alt="" loading="lazy" decoding="async">
                      <span v-else v-html="categoryIllustration(selectedProductCategory(product.categoryKey))"></span>
                    </span>
                    <span class="cb-ps-editor-modal__product-copy">
                      <strong>{{ productDisplayName(product) }}</strong>
                      <small>{{ productCategoryLabel(product.categoryKey) }}</small>
                      <span class="cb-ps-flow__product-unit-control">
                        <small class="cb-ps-flow__product-unit-caption">Máximo por producto: {{ formatParcelWeight(maxWeightForProduct(product)) }} {{ productWeightUnit(product) }}</small>
                        <span class="cb-ps-flow__product-unit" role="group" :aria-label="'Unidad de peso para ' + productDisplayName(product)">
                          <button type="button" :class="{ 'is-selected': productWeightUnit(product) === 'lb' }" :aria-pressed="productWeightUnit(product) === 'lb'" @click="setProductWeightUnit(product, 'lb')">lb</button>
                          <button type="button" :class="{ 'is-selected': productWeightUnit(product) === 'kg' }" :aria-pressed="productWeightUnit(product) === 'kg'" @click="setProductWeightUnit(product, 'kg')">kg</button>
                        </span>
                      </span>
                    </span>
                    <div class="cb-ps-editor-modal__weight-control">
                      <div class="cb-ps-flow__weight-control-head">
                        <label :for="'product-editor-weight-' + product.id" class="cb-ps-flow__weight-label">Peso estimado ({{ productWeightUnit(product) }})</label>
                      </div>
                      <div class="cb-ps-editor-modal__weight-input">
                        <input
                          :id="'product-editor-weight-' + product.id"
                          v-model.number="product.weight"
                          :class="{ 'is-invalid': shouldShowProductEditorWeightError(product) }"
                          type="number"
                          min="0.01"
                          :max="maxWeightForProduct(product)"
                          step="0.01"
                          inputmode="decimal"
                          required
                          :aria-invalid="!isProductWeightValid(product)"
                          :aria-describedby="shouldShowProductEditorWeightError(product) ? 'product-editor-error-' + product.id : null"
                          @blur="markProductEditorWeightTouched(product.id)"
                        >
                        <span>{{ weightUnit(product) }}</span>
                      </div>
                      <small v-if="shouldShowProductEditorWeightError(product)" :id="'product-editor-error-' + product.id" class="cb-ps-editor-modal__error" role="status">{{ productWeightErrorMessage(product) }}</small>
                    </div>
                    <div class="cb-ps-editor-modal__weight-control cb-ps-editor-modal__declared-value-control">
                      <label :for="'product-editor-value-' + product.id">Valor de compra (USD)</label>
                      <div class="cb-ps-editor-modal__weight-input" :class="{ 'is-invalid': shouldShowProductEditorDeclaredValueError(product) }">
                        <input
                          :id="'product-editor-value-' + product.id"
                          v-model.number="product.declaredValueUsd"
                          type="number"
                          min="0.01"
                          step="0.01"
                          inputmode="decimal"
                          required
                          :aria-invalid="!isProductDeclaredValueValid(product)"
                          :aria-describedby="shouldShowProductEditorDeclaredValueError(product) ? 'product-editor-value-error-' + product.id : null"
                          @blur="markProductEditorDeclaredValueTouched(product.id)"
                        >
                        <span>USD</span>
                      </div>
                      <small v-if="shouldShowProductEditorDeclaredValueError(product)" :id="'product-editor-value-error-' + product.id" class="cb-ps-editor-modal__error" role="status">{{ declaredValueErrorMessage(product) }}</small>
                      <small v-else-if="!product.declaredValueUsd" class="cb-ps-editor-modal__field-help">Indica el valor pagado de este producto.</small>
                    </div>
                    <button type="button" class="cb-ps-editor-modal__remove" :aria-label="'Quitar ' + productDisplayName(product)" @click="removeProductEditorItem(product.id)">
                      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 7h14M9 7V4h6v3m-8 0 1 13h8l1-13M10 11v5m4-5v5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" /></svg>
                    </button>
                  </article>
                </div>
                <p v-else class="cb-ps-editor-modal__empty">Selecciona al menos un producto para cotizar tu envío.</p>
                <p v-if="productEditorAttemptedSave && !productEditorDraft.length" class="cb-ps-editor-modal__error" role="alert">Agrega al menos un producto para continuar.</p>
              </section>

              <div class="cb-ps-editor-modal__total" :class="{ 'is-invalid': productEditorTotalWeightKg > maxShipmentWeightKg || productEditorTotalDeclaredValueUsd > maxShipmentValueUsd }" aria-live="polite">
                <span>Totales del envío</span>
                <strong>{{ formatParcelWeight(productEditorTotalWeightPounds) }} <small>lb</small> · {{ formatParcelWeight(productEditorTotalWeightKg) }} <small>kg</small> · USD {{ formatParcelPrice(productEditorTotalDeclaredValueUsd) }}</strong>
              </div>
              <p v-if="productEditorTotalWeightKg > maxShipmentWeightKg" class="cb-ps-flow__limit-error" role="alert">El peso de un envío no puede superar {{ formatParcelWeight(maxShipmentWeightKg) }} kg. Retire productos o divídalos en otro envío.</p>
              <p v-if="productEditorTotalDeclaredValueUsd > maxShipmentValueUsd" class="cb-ps-flow__limit-error" role="alert">El valor de los productos de un envío no puede superar USD {{ formatLimitAmount(maxShipmentValueUsd) }}. Retire productos o divídalos en otro envío.</p>
              <p v-if="productEditorAttemptedSave && productEditorHasInvalidDeclaredValue" class="cb-ps-editor-modal__error" role="alert">Ingresa el valor de compra en USD de cada producto con hasta 2 decimales.</p>
            </div>

            <footer class="cb-ps-editor-modal__footer">
              <button type="button" class="cb-ps-editor-modal__cancel" @click="closeProductEditor">Cancelar</button>
              <button type="button" class="cb-ps-editor-modal__save" @click="saveProductEditor">Guardar cambios <span aria-hidden="true">→</span></button>
            </footer>
          </section>
        </div>
      </transition>

    <transition name="cb-ps-video-modal">
      <div
        v-if="tutorialModalOpen"
        ref="tutorialModal"
        class="cb-ps-video-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cb-ps-video-modal-title"
        @click.self="closeTutorialModal"
      >
        <section class="cb-ps-video-modal__dialog">
          <header class="cb-ps-video-modal__header">
            <div class="cb-ps-video-modal__heading">
              <span class="cb-ps-video-modal__eyebrow">POSTAL SHOPPER · TUTORIAL</span>
              <h2 id="cb-ps-video-modal-title">{{ stepsSettings.tutorial_label || 'Cómo funciona Postal Shopper' }}</h2>
              <p v-if="stepsSettings.tutorial_duration">Aprende el proceso en {{ stepsSettings.tutorial_duration }}</p>
            </div>
            <button
              ref="tutorialModalClose"
              type="button"
              class="cb-ps-video-modal__close"
              aria-label="Cerrar video"
              @click="closeTutorialModal"
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              </svg>
            </button>
          </header>

          <div class="cb-ps-video-modal__player">
            <video
              v-if="isDirectVideoTutorial"
              :key="tutorialLink"
              :src="tutorialLink"
              :poster="stepsSettings.tutorial_image || null"
              controls
              autoplay
              playsinline
              preload="metadata"
              aria-label="Video tutorial de Postal Shopper"
            ></video>
            <iframe
              v-else-if="tutorialEmbedUrl"
              :src="tutorialEmbedUrl"
              title="Video tutorial de Postal Shopper"
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              referrerpolicy="strict-origin-when-cross-origin"
              allowfullscreen
            ></iframe>
            <div v-else class="cb-ps-video-modal__fallback">
              <span class="cb-ps-video-modal__fallback-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 16.5v-9Z" stroke="currentColor" stroke-width="1.7" />
                  <path d="m10 9 5 3-5 3V9Z" fill="currentColor" />
                </svg>
              </span>
              <p>Este enlace no se puede reproducir dentro de la página.</p>
              <a :href="tutorialLink" target="_blank" rel="noopener noreferrer">Abrir el tutorial en otra pestaña</a>
            </div>
          </div>
        </section>
      </div>
    </transition>

    <HomeFooter v-if="!isBootLoading" :logo-url="logoUrl" :icons="icons" :content="footerSettings" :links="footerLinks" />
  </div>
</template>

<script>
import { sanitizeContentTree } from '~/utils/contentSecurity'
import { fetchPageWithSharedLayout } from '~/utils/sharedLayout'

const POSTALSHOPPER_REGISTER_URL = 'https://clientescorreos.sistemaml.net/'
// These examples help describe a purchase only. They are never treated as official tariff categories.
const POSTALSHOPPER_REFERENCE_CATEGORIES = [
  { key: 'reference-clothing-footwear', label: 'Ropa y calzado', icon: 'clothing', confirmed: false, is_reference: true },
  { key: 'reference-technology', label: 'Tecnología', icon: 'technology', confirmed: false, is_reference: true },
  { key: 'reference-beauty', label: 'Belleza y cuidado personal', icon: 'beauty', confirmed: false, is_reference: true },
  { key: 'reference-home', label: 'Hogar', icon: 'home', confirmed: false, is_reference: true }
]
const POSTALSHOPPER_BASE_WEIGHT_TARIFF = [
  { weight: 1, price: 10.59 }, { weight: 2, price: 13.86 }, { weight: 3, price: 17.14 },
  { weight: 4, price: 20.41 }, { weight: 5, price: 23.70 }, { weight: 6, price: 27.70 },
  { weight: 7, price: 31.70 }, { weight: 8, price: 35.70 }, { weight: 9, price: 39.70 },
  { weight: 10, price: 43.70 }, { weight: 11, price: 47.70 }, { weight: 12, price: 51.70 },
  { weight: 13, price: 55.70 }, { weight: 14, price: 59.70 }, { weight: 15, price: 63.70 },
  { weight: 16, price: 67.70 }, { weight: 17, price: 71.70 }, { weight: 18, price: 75.70 },
  { weight: 19, price: 79.70 }, { weight: 20, price: 83.70 }
]
const POSTALSHOPPER_EXCESS_RATE_PER_POUND = 4
const POSTALSHOPPER_POUNDS_PER_KG = 2.20462262185
const POSTALSHOPPER_MAX_WEIGHT_KG = 20
const POSTALSHOPPER_MAX_WEIGHT_POUNDS = 44
const POSTALSHOPPER_WEIGHT_TARIFF = Array.from({ length: POSTALSHOPPER_MAX_WEIGHT_POUNDS }, (_, index) => {
  const weight = index + 1
  const baseRate = POSTALSHOPPER_BASE_WEIGHT_TARIFF.find((rate) => rate.weight === weight)
  return {
    weight,
    price: baseRate ? baseRate.price : Math.round((POSTALSHOPPER_BASE_WEIGHT_TARIFF[19].price + (weight - 20) * POSTALSHOPPER_EXCESS_RATE_PER_POUND + Number.EPSILON) * 100) / 100
  }
})

const POSTALSHOPPER_SOURCE_PAGE = {
  meta_title: '',
  meta_description: '',
  theme: { logo_url: '', primary_color: '#0d47b5', secondary_color: '#2a4268', accent_color: '#ffcc18' },
  sections: [
    { key: 'header', settings: {}, items: [], is_active: true },
    {
      key: 'postalshopper_hero',
      settings: {
        badge: '',
        title_line_one_white: '',
        title_line_one_yellow: '',
        title_line_two_white: '',
        title_line_two_yellow: '',
        title_line_three_yellow: '',
        lead_text: '',
        subtitle: '',
        primary_button_label: '',
        primary_button_url: '',
        secondary_button_label: '',
        secondary_button_url: '',
        background_image: '',
        map_origin_country: '',
        map_origin_city: '',
        map_destination_country: '',
        map_destination_city: '',
        map_caption: ''
      },
      items: [],
      is_active: true
    },
    {
      key: 'postalshopper_destinations',
      settings: { upcoming_label: 'Nuevos envíos', upcoming_status: 'Muy pronto', upcoming_enabled: true },
      items: [],
      is_active: true
    },
    { key: 'postalshopper_intro', settings: { eyebrow: '', title: '', paragraph_one: '', paragraph_two: '' }, items: [], is_active: true },
    {
      key: 'postalshopper_steps',
      settings: {
        title: '¿Cómo funciona Postal Shopper?',
        subtitle: 'Mira el tutorial y compra desde Estados Unidos en 3 pasos',
        tutorial_url: '',
        tutorial_image: '',
        tutorial_label: 'Ver tutorial completo',
        tutorial_duration: '1:30 min'
      },
      items: [
        { id: 'step-1', data: { step: '01', icon: 'pin', title: 'Regístrate gratis', text: '' } },
        { id: 'step-2', data: { step: '02', icon: 'cart', title: 'Compra y envía a tu casilla', text: '' } },
        { id: 'step-3', data: { step: '03', icon: 'package', title: 'Recibe tu paquete en Bolivia', text: '' } }
      ],
      is_active: true
    },
    {
      key: 'postalshopper_calculator',
      settings: {
        eyebrow: 'COTIZADOR DE ENVÍOS',
        title: 'Cotiza tu',
        title_accent: 'compra',
        description: '¿Qué productos vas a recibir en tu casilla?',
        products_title: '¿Qué productos vas a recibir en tu casilla?',
        products_help: 'Agrega cada producto por separado. Puedes indicar más de una categoría.',
        unclassified_notice: 'Estas opciones son orientativas y no representan categorías oficiales ni determinan una tarifa. La clasificación, admisión y costo se confirman con el proveedor.',
        weight_title: '¿Cuánto pesa cada producto?',
        weight_help: 'Ingresa el peso estimado de cada producto y revisa el peso total del envío.',
        weight_unit_singular: 'libra',
        weight_unit_plural: 'libras',
        currency_label: 'USD',
        max_shipment_weight_kg: 20,
        max_shipment_value_usd: 999,
        usd_to_bob_rate: 11.70,
        usd_to_bob_rate_note: 'BCB · TCO vigente al 17/11/2026',
        postal_modality_label: 'Modalidad de envío: Postal a Postal',
        delivery_estimate_notice: 'Tiempo estimado de entrega: 15 días a partir del pago de su envío.',
        customs_notice: 'La tarifa no incluye tributos aduaneros, que se liquidan conforme a normativa vigente.',
        max_weight_kg: POSTALSHOPPER_MAX_WEIGHT_KG,
        max_weight_lb: POSTALSHOPPER_MAX_WEIGHT_POUNDS,
        total_label: 'Tarifa estimada',
        excess_weight_price_per_lb: POSTALSHOPPER_EXCESS_RATE_PER_POUND,
        shipping_label: 'Envío Postal Shopper',
        quote_title: 'Resumen de tu cotización',
        quote_help: 'Revisa los productos, categorías y peso estimado.',
        pending_quote_title: 'Cotización pendiente de confirmación',
        pending_quote_message: 'No hay una tarifa cargada para el peso indicado ni una regla confirmada para los productos seleccionados.',
        image: '',
        image_alt: 'Cartero con un paquete y una calculadora de envíos',
        caption_label: 'POSTAL SHOPPER',
        caption_text: 'Tus compras, de Miami a Bolivia'
      },
      items: [
        ...POSTALSHOPPER_WEIGHT_TARIFF.map((rate) => ({ id: `rate-${rate.weight}`, data: rate }))
      ],
      is_active: true
    },
    {
      key: 'postalshopper_benefits',
      settings: { title: '', subtitle: '', banner_title: '', banner_text: '', banner_button_label: '', banner_button_url: '' },
      items: [],
      is_active: true
    },
    { key: 'footer', settings: {}, items: [], is_active: true }
  ]
}

export default {
  name: 'PostalShopperPage',
  async asyncData({ $api }) {
    const payload = await fetchPage($api)
    return { pageContent: normalizePage(payload || POSTALSHOPPER_SOURCE_PAGE, POSTALSHOPPER_SOURCE_PAGE) }
  },
  data() {
    return {
      isBootLoading: true,
      calculatorStep: 1,
      parcelProducts: [],
      nextParcelProductId: 1,
      weightTouched: {},
      declaredValueTouched: {},
      productEditorOpen: false,
      productEditorDraft: [],
      productEditorDraftTouched: {},
      productEditorDraftValueTouched: {},
      productEditorAttemptedSave: false,
      productEditorTriggerElement: null,
      productEditorPreviousBodyOverflow: '',
      categoryStripHasOverflow: false,
      tutorialModalOpen: false,
      tutorialTriggerElement: null,
      tutorialPreviousBodyOverflow: ''
    }
  },
  async mounted() {
    window.addEventListener('resize', this.updateCategoryStripOverflow)

    if (!this.logoUrl) {
      await this.refreshPageContent()
      this.$nextTick(this.updateCategoryStripOverflow)
      return
    }

    this.isBootLoading = false
    this.$nextTick(this.updateCategoryStripOverflow)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateCategoryStripOverflow)
    if (this.tutorialModalOpen) this.cleanupTutorialModal()
    if (this.productEditorOpen) this.cleanupProductEditor()
  },
  watch: {
    calculatorStep(step) {
      if (step === 1) this.$nextTick(this.updateCategoryStripOverflow)
    },
    isBootLoading(isLoading) {
      if (!isLoading) this.$nextTick(this.updateCategoryStripOverflow)
    },
    tariffCategories: {
      deep: true,
      handler() {
        this.$nextTick(this.updateCategoryStripOverflow)
      }
    }
  },
  computed: {
    resolvedPageContent() {
      return this.pageContent || POSTALSHOPPER_SOURCE_PAGE
    },
    icons() {
      return buildIcons()
    },
    logoUrl() {
      return this.resolvedPageContent.theme.logo_url || ''
    },
    themeStyles() {
      const theme = this.resolvedPageContent.theme || {}
      return {
        '--cb-blue': theme.primary_color || '#0d47b5',
        '--cb-yellow': theme.accent_color || '#ffcc18',
        '--cb-ink': theme.secondary_color || '#2a4268'
      }
    },
    heroStyles() {
      const image = this.heroSettings.background_image || '/personajechica.png'
      return { '--cb-ps-hero-image': `url(${image})` }
    },
    calculatorStepLabels() {
      return [
        this.calculatorSettings.step_products_label || 'Productos',
        this.calculatorSettings.step_weight_label || 'Peso',
        this.calculatorSettings.step_quote_label || 'Cotización'
      ]
    },
    calculatorCurrentHeading() {
      if (this.calculatorStep === 1) {
        return {
          title: this.calculatorSettings.title || 'Cotiza tu',
          accent: this.calculatorSettings.title_accent || 'compra',
          subtitle: this.calculatorSettings.description || '¿Qué productos vas a recibir en tu casilla?'
        }
      }
      if (this.calculatorStep === 2) {
        return {
          title: this.calculatorSettings.weight_title || '¿Cuánto pesa cada producto?',
          accent: '',
          subtitle: this.calculatorSettings.weight_help || 'Ingresa el peso estimado de cada producto y elige lb o kg.'
        }
      }
      return {
        title: this.calculatorSettings.quote_title || 'Resumen de tu cotización',
        accent: '',
        subtitle: this.calculatorSettings.quote_help || 'Revisa los productos y el peso estimado.'
      }
    },
    maxWeightPounds() {
      const configured = Number(this.calculatorSettings.max_weight_lb)
      return Number.isFinite(configured) && configured > 0
        ? Math.min(POSTALSHOPPER_MAX_WEIGHT_POUNDS, Math.max(1, Math.floor(configured)))
        : POSTALSHOPPER_MAX_WEIGHT_POUNDS
    },
    maxWeightKg() {
      const configured = Number(this.calculatorSettings.max_weight_kg)
      return Number.isFinite(configured) && configured > 0
        ? Math.min(POSTALSHOPPER_MAX_WEIGHT_KG, configured)
        : POSTALSHOPPER_MAX_WEIGHT_KG
    },
    maxShipmentWeightKg() {
      const configured = Number(this.calculatorSettings.max_shipment_weight_kg)
      return Number.isFinite(configured) && configured > 0 ? configured : 20
    },
    maxShipmentValueUsd() {
      const configured = Number(this.calculatorSettings.max_shipment_value_usd)
      return Number.isFinite(configured) && configured > 0 ? configured : 999
    },
    tariffCategories() {
      const categories = this.calculatorSettings.categories
      const configured = Array.isArray(categories)
        ? categories.filter((category) => category && category.key && category.label && category.is_active !== false)
        : []
      return Array.isArray(categories) ? configured : POSTALSHOPPER_REFERENCE_CATEGORIES
    },
    hasOfficialProductCategories() {
      const categories = this.calculatorSettings.categories
      return Array.isArray(categories) && categories.some((category) => category && category.key && category.label && category.is_active !== false && !this.isReferenceCategory(category))
    },
    weightTariffRates() {
      const configuredRates = this.getSectionItems('postalshopper_calculator')
        .filter((item) => Number.isInteger(Number(item.weight)) && Number(item.weight) >= 1 && Number(item.weight) <= this.maxWeightPounds)
      const configuredByWeight = new Map(configuredRates
        .map((item) => [Number(item.weight), Number(item.price)])
        .filter(([, price]) => Number.isFinite(price) && price > 0))
      const configuredExtraRate = Number(this.calculatorSettings.excess_weight_price_per_lb)
      const extraRate = Number.isFinite(configuredExtraRate) && configuredExtraRate > 0
        ? configuredExtraRate
        : POSTALSHOPPER_EXCESS_RATE_PER_POUND
      const configuredTwentyPoundPrice = configuredByWeight.get(20)
      const twentyPoundPrice = Number.isFinite(configuredTwentyPoundPrice)
        ? configuredTwentyPoundPrice
        : POSTALSHOPPER_BASE_WEIGHT_TARIFF[19].price

      return Array.from({ length: Math.floor(this.maxWeightPounds) }, (_, index) => {
        const weight = index + 1
        const baseRate = POSTALSHOPPER_BASE_WEIGHT_TARIFF.find((rate) => rate.weight === weight)
        const fallbackPrice = baseRate
          ? baseRate.price
          : Math.round((twentyPoundPrice + (weight - 20) * extraRate + Number.EPSILON) * 100) / 100
        const configuredPrice = configuredByWeight.get(weight)
        return {
          weight,
          price: Number.isFinite(configuredPrice) ? configuredPrice : fallbackPrice
        }
      })
    },
    weightTariffQuote() {
      if (!this.quoteInputsAreValid) return null

      const weight = Math.round((this.totalParcelWeightPounds + Number.EPSILON) * 100) / 100
      if (!Number.isFinite(weight) || weight <= 0) return null
      const billableWeight = Math.max(1, Math.ceil(weight - 1e-9))
      const ratesByWeight = new Map(this.weightTariffRates.map((rate) => [rate.weight, rate.price]))
      const configuredExtraRate = this.calculatorSettings.excess_weight_price_per_lb
      const extraRateValue = configuredExtraRate === '' || configuredExtraRate === null || configuredExtraRate === undefined
        ? Number.NaN
        : Number(configuredExtraRate)
      const extraRate = Number.isFinite(extraRateValue) && extraRateValue > 0
        ? extraRateValue
        : POSTALSHOPPER_EXCESS_RATE_PER_POUND
      const currency = 'USD'

      if (billableWeight <= 20) {
        const basePrice = ratesByWeight.get(billableWeight)
        if (!Number.isFinite(basePrice)) return null

        return {
          currency,
          billable_weight: billableWeight,
          base_weight: billableWeight,
          base_price: basePrice,
          extra_weight: 0,
          extra_rate: extraRate,
          extra_price: 0,
          shipping_price: basePrice
        }
      }

      const basePrice = ratesByWeight.get(20)
      const configuredShippingPrice = ratesByWeight.get(billableWeight)
      const shippingPrice = Number.isFinite(configuredShippingPrice)
        ? configuredShippingPrice
        : Math.round((basePrice + ((billableWeight - 20) * extraRate) + Number.EPSILON) * 100) / 100
      if (!Number.isFinite(basePrice) || !Number.isFinite(shippingPrice)) return null

      const extraWeight = billableWeight - 20
      const extraPrice = Math.round((shippingPrice - basePrice + Number.EPSILON) * 100) / 100
      return {
        currency,
        billable_weight: billableWeight,
        base_weight: 20,
        base_price: basePrice,
        extra_weight: extraWeight,
        extra_rate: extraWeight ? Math.round((extraPrice / extraWeight + Number.EPSILON) * 100) / 100 : extraRate,
        extra_price: extraPrice,
        shipping_price: shippingPrice
      }
    },
    productsAreValid() {
      return this.parcelProducts.length > 0 && this.parcelProducts.every((product) => {
        return Boolean(product.categoryKey)
      })
    },
    weightsAreValid() {
      return this.productsAreValid
        && this.parcelProducts.every((product) => this.isProductWeightValid(product))
        && this.totalParcelWeightKg <= this.maxShipmentWeightKg
    },
    declaredValuesAreValid() {
      return this.productsAreValid
        && this.parcelProducts.every((product) => this.isProductDeclaredValueValid(product))
        && this.totalDeclaredValueUsd <= this.maxShipmentValueUsd
    },
    productEditorHasInvalidDeclaredValue() {
      return this.productEditorDraft.some((product) => !this.isProductDeclaredValueValid(product))
    },
    quoteInputsAreValid() {
      return this.weightsAreValid && this.declaredValuesAreValid
    },
    productEditorDraftValid() {
      return this.productEditorDraft.length > 0 && this.productEditorDraft.every((product) => {
        return Boolean(product.categoryKey) && this.isProductWeightValid(product) && this.isProductDeclaredValueValid(product)
      }) && this.productEditorTotalWeightKg <= this.maxShipmentWeightKg
        && this.productEditorTotalDeclaredValueUsd <= this.maxShipmentValueUsd
    },
    productEditorTotalWeightPounds() {
      return this.productEditorDraft.reduce((total, product) => total + this.productWeightInPounds(product), 0)
    },
    totalParcelWeightPounds() {
      return this.parcelProducts.reduce((total, product) => total + this.productWeightInPounds(product), 0)
    },
    totalParcelWeightKg() {
      return this.parcelProducts.reduce((total, product) => total + this.productWeightInKg(product), 0)
    },
    totalDeclaredValueUsd() {
      const total = this.parcelProducts.reduce((sum, product) => sum + this.productDeclaredValue(product), 0)
      return Math.round((total + Number.EPSILON) * 100) / 100
    },
    shipmentWeightExceeded() {
      return this.totalParcelWeightKg > this.maxShipmentWeightKg
    },
    shipmentValueExceeded() {
      return this.totalDeclaredValueUsd > this.maxShipmentValueUsd
    },
    usdToBobRate() {
      const rate = Number(String(this.calculatorSettings.usd_to_bob_rate == null ? '' : this.calculatorSettings.usd_to_bob_rate).replace(',', '.'))
      return Number.isFinite(rate) && rate > 0 ? rate : null
    },
    quoteShippingPriceBs() {
      if (!this.weightTariffQuote || this.usdToBobRate === null) return null
      return Math.round((this.weightTariffQuote.shipping_price * this.usdToBobRate + Number.EPSILON) * 100) / 100
    },
    productEditorTotalWeightKg() {
      return this.productEditorDraft.reduce((total, product) => total + this.productWeightInKg(product), 0)
    },
    productEditorTotalDeclaredValueUsd() {
      const total = this.productEditorDraft.reduce((sum, product) => sum + this.productDeclaredValue(product), 0)
      return Math.round((total + Number.EPSILON) * 100) / 100
    },
    headerSettings() {
      return this.getSectionSettings('header')
    },
    footerSettings() {
      return this.getSectionSettings('footer')
    },
    headerLinks() {
      return this.getSectionItems('header')
    },
    footerLinks() {
      return this.getSectionItems('footer')
    },
    heroSettings() {
      return this.getSectionSettings('postalshopper_hero')
    },
    heroParagraphs() {
      const normalizeParagraph = (paragraph, index) => {
        const text = typeof paragraph === 'string' ? paragraph : paragraph?.text
        return {
          text: String(text || '').trim(),
          style: typeof paragraph === 'object' && paragraph?.style === 'lead'
            ? 'lead'
            : (index === 0 && typeof paragraph === 'string' ? 'lead' : 'body')
        }
      }
      const configuredParagraphs = this.heroSettings.paragraphs
      const legacyParagraphs = [
        { text: this.heroSettings.lead_text, style: 'lead' },
        { text: this.heroSettings.subtitle, style: 'body' }
      ].filter((paragraph) => String(paragraph.text || '').trim())
      const paragraphs = Array.isArray(configuredParagraphs) && (configuredParagraphs.length || !legacyParagraphs.length)
        ? configuredParagraphs
        : legacyParagraphs

      return paragraphs
        .map((paragraph, index) => normalizeParagraph(paragraph, index))
        .filter((paragraph) => paragraph.text)
    },
    primaryButtonLabel() {
      const label = String(this.heroSettings.primary_button_label || '').trim()
      return ['como funciona', 'ver tutorial'].includes(label.toLowerCase()) ? 'Cómo funciona' : (label || 'Cómo funciona')
    },
    secondaryButtonUrl() {
      const url = String(this.heroSettings.secondary_button_url || '').trim()
      if (!url || url === '#' || url === '/contacto') {
        const directService = this.availableDestinationItems.find((item) => item.url)
        return directService?.url || POSTALSHOPPER_REGISTER_URL
      }

      return url
    },
    stepsSettings() {
      const settings = this.getSectionSettings('postalshopper_steps')
      const legacyTitle = 'Tu puente directo entre Miami y Bolivia.'
      const legacySubtitle = 'Hemos simplificado el proceso de importacion para que tu unica preocupacion sea decidir que comprar hoy.'

      return {
        ...settings,
        title: settings.title === legacyTitle ? '¿Cómo funciona Postal Shopper?' : settings.title,
        subtitle: settings.subtitle === legacySubtitle ? 'Mira el tutorial y compra desde Estados Unidos en 3 pasos' : settings.subtitle
      }
    },
    calculatorSettings() {
      const settings = this.getSectionSettings('postalshopper_calculator')
      return {
        ...settings,
        title: settings.title === 'Cotiza tu paquete' ? 'Cotiza tu' : settings.title,
        title_accent: settings.title_accent === 'en segundos.' ? 'compra' : settings.title_accent,
        description: settings.description === 'Consulta una tarifa estimada para tu envío.' ? '¿Qué productos vas a recibir en tu casilla?' : settings.description,
        weight_title: settings.weight_title === 'Elige el peso del paquete' ? '¿Cuánto pesa cada producto?' : settings.weight_title,
        weight_help: settings.weight_help === 'Selecciona entre 1 y 5 libras'
          || settings.weight_help === 'Ingresa el peso estimado de cada producto.'
          || settings.weight_help === 'Ingresa el peso y el valor de compra en USD de cada producto. Límites por envío: 20 kg y USD 999.'
          || settings.weight_help === 'Ingresa el peso y el valor de compra en USD de cada producto. Máximos por envío: 20 kg y USD 999.'
          || settings.weight_help === 'Ingresa el peso de cada producto. Máximo por producto: 20 kg o 44 lb.'
          || !settings.weight_help
          || /máximo total del envío/i.test(settings.weight_help)
          ? 'Ingresa el peso estimado de cada producto y revisa el peso total del envío.'
          : settings.weight_help,
        unclassified_notice: settings.unclassified_notice === 'No hay categorías oficiales ni restricciones configuradas en la información disponible. Describe tu compra; su clasificación y admisión deben confirmarse con el proveedor.'
          ? 'Estas opciones son orientativas y no representan categorías oficiales ni determinan una tarifa. La clasificación, admisión y costo se confirman con el proveedor.'
          : settings.unclassified_notice,
        quote_weight_total_label: settings.quote_weight_total_label === 'Peso total estimado'
          ? 'Peso total del envío'
          : settings.quote_weight_total_label || 'Peso total del envío',
        usd_to_bob_rate: Number(settings.usd_to_bob_rate) > 0 ? Number(settings.usd_to_bob_rate) : 11.70,
        usd_to_bob_rate_note: settings.usd_to_bob_rate_note || 'BCB · TCO vigente al 17/11/2026',
        postal_modality_label: settings.postal_modality_label || 'Modalidad de envío: Postal a Postal',
        delivery_estimate_notice: settings.delivery_estimate_notice || 'Tiempo estimado de entrega: 15 días a partir del pago de su envío.',
        customs_notice: settings.customs_notice || 'La tarifa no incluye tributos aduaneros, que se liquidan conforme a normativa vigente.',
        max_shipment_weight_kg: Number(settings.max_shipment_weight_kg) > 0 ? Number(settings.max_shipment_weight_kg) : 20,
        max_shipment_value_usd: Number(settings.max_shipment_value_usd) > 0 ? Number(settings.max_shipment_value_usd) : 999,
      }
    },
    tutorialLink() {
      return [this.stepsSettings.tutorial_url, this.heroSettings.primary_button_url]
        .map((url) => String(url || '').trim())
        .find((url) => url && url !== '#') || ''
    },
    isDirectVideoTutorial() {
      return /\.(?:mp4|webm|ogg)(?:$|[?#])/i.test(this.tutorialLink)
    },
    tutorialEmbedUrl() {
      const url = this.tutorialLink
      const youtube = url.match(/(?:youtube(?:-nocookie)?\.com\/(?:.*[?&]v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{6,})/i)
      if (youtube) return `https://www.youtube-nocookie.com/embed/${youtube[1]}?autoplay=1&rel=0`

      const vimeo = url.match(/(?:player\.)?vimeo\.com\/(?:video\/)?([0-9]+)/i)
      if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1`

      return ''
    },
    heroTitleRows() {
      const rows = []
      const titleOneWhite = String(this.heroSettings.title_line_one_white || '').trim()
      const titleOneYellow = String(this.heroSettings.title_line_one_yellow || '').trim()
      const titleTwoWhite = String(this.heroSettings.title_line_two_white || '').trim()
      const titleTwoYellow = String(this.heroSettings.title_line_two_yellow || '').trim()
      const titleThreeYellow = String(this.heroSettings.title_line_three_yellow || '').trim()

      if (titleOneWhite || titleOneYellow) rows.push({ white: titleOneWhite, yellow: titleOneYellow })
      if (titleTwoWhite || titleTwoYellow) rows.push({ white: titleTwoWhite, yellow: titleTwoYellow })

      if (titleThreeYellow) {
        rows.push({ white: '', yellow: titleThreeYellow })
      }

      return rows.filter((row) => String(row.white || row.yellow || '').trim() !== '')
    },
    introSettings() {
      return this.getSectionSettings('postalshopper_intro')
    },
    benefitsSettings() {
      return this.getSectionSettings('postalshopper_benefits')
    },
    heroFeatureItems() {
      return this.getSectionItems('postalshopper_hero')
    },
    stepItems() {
      const savedItems = this.getSectionItems('postalshopper_steps')
      const fallbackSection = POSTALSHOPPER_SOURCE_PAGE.sections.find((section) => section.key === 'postalshopper_steps')
      const items = savedItems.length
        ? savedItems
        : (fallbackSection?.items || []).map((item) => ({ ...(item.data || item), id: item.id }))
      const legacyTitles = ['Tu Direccion Americana', 'Compra sin Limites', 'Consolidacion y Ahorro', 'El Vuelo a Casa']

      if (items.length !== legacyTitles.length || !items.every((item, index) => item.title === legacyTitles[index])) {
        return items
      }

      return [
        { ...items[0], step: '1', icon: 'user-plus', title: 'Regístrate gratis', text: '' },
        { ...items[1], step: '2', icon: 'cart', title: 'Compra y envía a tu casilla', text: '' },
        { ...items[3], step: '3', icon: 'package', title: 'Recibe tu paquete en Bolivia', text: '' }
      ]
    },
    marketChips() {
      return this.getSectionItems('postalshopper_intro')
    },
    destinationItems() {
      return this.getSectionItems('postalshopper_destinations')
    },
    destinationSettings() {
      return this.getSectionSettings('postalshopper_destinations')
    },
    availableDestinationItems() {
      return this.destinationItems.filter((item) => {
        return this.isDestinationAvailable(item.status)
          && String(item.label || '').trim().toLowerCase() !== 'nuevos destinos'
      })
    },
    hasUpcomingDestinations() {
      return this.destinationSettings.upcoming_enabled !== false
    },
    marketMarqueeItems() {
      return [...this.marketChips, ...this.marketChips]
    },
    benefitItems() {
      return this.getSectionItems('postalshopper_benefits')
    }
  },
  methods: {
    quoteNoteTitle(value, fallbackTitle) {
      const text = String(value || '').trim()
      const separator = text.indexOf(':')
      return separator > 0 && separator <= 55 ? text.slice(0, separator).trim() : fallbackTitle
    },
    quoteNoteBody(value, fallbackText) {
      const text = String(value || fallbackText).trim()
      const separator = text.indexOf(':')
      return separator > 0 && separator <= 55 ? text.slice(separator + 1).trim() : text
    },
    updateCategoryStripOverflow() {
      const scroller = this.$refs.categoryScroller
      this.categoryStripHasOverflow = Boolean(scroller && scroller.scrollWidth > scroller.clientWidth + 2)
    },
    selectProductCategory(categoryKey) {
      const category = this.selectedProductCategory(categoryKey)
      if (!category) return

      const existingProduct = this.parcelProducts.find((product) => product.categoryKey === categoryKey)
      if (existingProduct) {
        this.removeParcelProduct(existingProduct.id)
        return
      }

      this.parcelProducts.push({
        id: `product-${this.nextParcelProductId}`,
        name: category.label,
        categoryKey,
        weight: '',
        declaredValueUsd: '',
        weightUnit: 'lb'
      })
      this.nextParcelProductId += 1
    },
    isProductCategorySelected(categoryKey) {
      return this.parcelProducts.some((product) => product.categoryKey === categoryKey)
    },
    removeParcelProduct(productId) {
      this.parcelProducts = this.parcelProducts.filter((product) => product.id !== productId)
      this.$delete(this.weightTouched, productId)
      this.$delete(this.declaredValueTouched, productId)
    },
    markWeightTouched(productId) {
      this.$set(this.weightTouched, productId, true)
    },
    shouldShowWeightError(product) {
      return Boolean(this.weightTouched[product.id]) && !this.isProductWeightValid(product)
    },
    markDeclaredValueTouched(productId) {
      this.$set(this.declaredValueTouched, productId, true)
    },
    shouldShowDeclaredValueError(product) {
      return Boolean(this.declaredValueTouched[product.id]) && !this.isProductDeclaredValueValid(product)
    },
    openProductEditor(event) {
      if (this.productEditorOpen) return

      this.productEditorTriggerElement = event?.currentTarget || document.activeElement
      this.productEditorDraft = this.parcelProducts.map((product) => ({ ...product }))
      this.productEditorDraftTouched = {}
      this.productEditorDraftValueTouched = {}
      this.productEditorAttemptedSave = false
      this.productEditorPreviousBodyOverflow = document.body.style.overflow
      this.productEditorOpen = true
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', this.handleProductEditorKeydown)

      this.$nextTick(() => {
        this.$refs.productEditorClose?.focus()
      })
    },
    closeProductEditor() {
      if (!this.productEditorOpen) return

      this.productEditorOpen = false
      this.cleanupProductEditor()
      const triggerElement = this.productEditorTriggerElement
      this.productEditorTriggerElement = null
      this.productEditorDraft = []
      this.productEditorDraftTouched = {}
      this.productEditorDraftValueTouched = {}
      this.productEditorAttemptedSave = false

      this.$nextTick(() => {
        if (triggerElement && document.contains(triggerElement)) triggerElement.focus()
      })
    },
    cleanupProductEditor() {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = this.productEditorPreviousBodyOverflow || ''
      }
      if (typeof window !== 'undefined') {
        window.removeEventListener('keydown', this.handleProductEditorKeydown)
      }
    },
    handleProductEditorKeydown(event) {
      if (event.key === 'Escape') {
        event.preventDefault()
        this.closeProductEditor()
        return
      }

      if (event.key !== 'Tab') return
      const focusable = this.$refs.productEditorModal?.querySelectorAll('button:not([disabled]), input:not([disabled])')
      if (!focusable?.length) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    },
    isProductEditorCategorySelected(categoryKey) {
      return this.productEditorDraft.some((product) => product.categoryKey === categoryKey)
    },
    toggleProductEditorCategory(categoryKey) {
      const existingProduct = this.productEditorDraft.find((product) => product.categoryKey === categoryKey)
      if (existingProduct) {
        this.removeProductEditorItem(existingProduct.id)
        return
      }

      const category = this.selectedProductCategory(categoryKey)
      if (!category) return

      this.productEditorDraft.push({
        id: `product-${this.nextParcelProductId}`,
        name: category.label,
        categoryKey,
        weight: '',
        declaredValueUsd: '',
        weightUnit: 'lb'
      })
      this.nextParcelProductId += 1
    },
    removeProductEditorItem(productId) {
      this.productEditorDraft = this.productEditorDraft.filter((product) => product.id !== productId)
      this.$delete(this.productEditorDraftTouched, productId)
      this.$delete(this.productEditorDraftValueTouched, productId)
    },
    markProductEditorWeightTouched(productId) {
      this.$set(this.productEditorDraftTouched, productId, true)
    },
    shouldShowProductEditorWeightError(product) {
      return Boolean(this.productEditorAttemptedSave || this.productEditorDraftTouched[product.id])
        && !this.isProductWeightValid(product)
    },
    markProductEditorDeclaredValueTouched(productId) {
      this.$set(this.productEditorDraftValueTouched, productId, true)
    },
    shouldShowProductEditorDeclaredValueError(product) {
      return Boolean(this.productEditorAttemptedSave || this.productEditorDraftValueTouched[product.id])
        && !this.isProductDeclaredValueValid(product)
    },
    saveProductEditor() {
      this.productEditorAttemptedSave = true
      if (!this.productEditorDraftValid) {
        this.$nextTick(() => {
          const firstInvalidInput = this.$refs.productEditorModal?.querySelector('.cb-ps-editor-modal__weight-input input[aria-invalid="true"]')
          if (firstInvalidInput) firstInvalidInput.focus()
        })
        return
      }

      this.parcelProducts = this.productEditorDraft.map((product) => ({ ...product }))
      const currentIds = new Set(this.parcelProducts.map((product) => product.id))
      this.weightTouched = Object.keys(this.weightTouched).reduce((touched, productId) => {
        if (currentIds.has(productId)) touched[productId] = this.weightTouched[productId]
        return touched
      }, {})
      this.declaredValueTouched = Object.keys(this.declaredValueTouched).reduce((touched, productId) => {
        if (currentIds.has(productId)) touched[productId] = this.declaredValueTouched[productId]
        return touched
      }, {})
      this.closeProductEditor()
    },
    continueToQuote() {
      const invalidProducts = this.parcelProducts.filter((product) => !this.isProductWeightValid(product))
      const invalidValueProducts = this.parcelProducts.filter((product) => !this.isProductDeclaredValueValid(product))
      if (!this.quoteInputsAreValid) {
        invalidProducts.forEach((product) => this.markWeightTouched(product.id))
        invalidValueProducts.forEach((product) => this.markDeclaredValueTouched(product.id))
        this.$nextTick(() => {
          const firstInvalidInput = this.$el.querySelector('.cb-ps-flow__weight-input input[aria-invalid="true"]')
          if (firstInvalidInput) firstInvalidInput.focus()
        })
        return
      }
      this.calculatorStep = 3
    },
    isProductWeightValid(product) {
      const weight = Number(product.weight)
      return Number.isFinite(weight)
        && weight > 0
        && weight <= this.maxWeightForProduct(product)
        && Math.abs(weight * 100 - Math.round(weight * 100)) < 1e-7
    },
    isProductDeclaredValueValid(product) {
      const value = Number(product && product.declaredValueUsd)
      return Number.isFinite(value)
        && value > 0
        && Math.abs(value * 100 - Math.round(value * 100)) < 1e-7
    },
    declaredValueErrorMessage(product) {
      const value = Number(product && product.declaredValueUsd)
      const hasValidPrecision = Number.isFinite(value)
        && value > 0
        && Math.abs(value * 100 - Math.round(value * 100)) < 1e-7
      return hasValidPrecision ? 'Ingresa un valor de compra positivo en USD.' : 'Ingresa un valor de compra en USD con hasta 2 decimales.'
    },
    productDeclaredValue(product) {
      const value = Number(product && product.declaredValueUsd)
      return Number.isFinite(value) && value > 0 ? value : 0
    },
    productWeightErrorMessage(product) {
      const weight = Number(product.weight)
      const hasValidPrecision = Number.isFinite(weight)
        && weight > 0
        && Math.abs(weight * 100 - Math.round(weight * 100)) < 1e-7

      if (!hasValidPrecision) return 'Ingresa un peso positivo con hasta 2 decimales.'
      return `El peso no puede superar ${this.formatParcelWeight(this.maxWeightForProduct(product))} ${this.productWeightUnit(product)}.`
    },
    formatParcelWeight(value) {
      const weight = Number(value)
      return Number.isFinite(weight)
        ? weight.toLocaleString('es-BO', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
        : '0'
    },
    weightUnit(product) {
      return this.productWeightUnit(product)
    },
    productWeightUnit(product) {
      return product && product.weightUnit === 'kg' ? 'kg' : 'lb'
    },
    maxWeightForProduct(product) {
      return this.productWeightUnit(product) === 'kg' ? this.maxWeightKg : this.maxWeightPounds
    },
    productWeightInPounds(product) {
      const weight = Number(product && product.weight)
      if (!Number.isFinite(weight) || weight <= 0) return 0
      return this.productWeightUnit(product) === 'kg' ? weight * POSTALSHOPPER_POUNDS_PER_KG : weight
    },
    productWeightInKg(product) {
      const weight = Number(product && product.weight)
      if (!Number.isFinite(weight) || weight <= 0) return 0
      return this.productWeightUnit(product) === 'lb' ? weight / POSTALSHOPPER_POUNDS_PER_KG : weight
    },
    setProductWeightUnit(product, unit) {
      if (unit !== 'kg' && unit !== 'lb') return
      if (!product || unit === this.productWeightUnit(product)) return

      const weight = Number(product.weight)
      if (Number.isFinite(weight) && weight > 0) {
        const pounds = this.productWeightUnit(product) === 'kg' ? weight * POSTALSHOPPER_POUNDS_PER_KG : weight
        const convertedWeight = unit === 'kg' ? pounds / POSTALSHOPPER_POUNDS_PER_KG : pounds
        this.$set(product, 'weight', Math.round((convertedWeight + Number.EPSILON) * 100) / 100)
      }
      this.$set(product, 'weightUnit', unit)
    },
    isCategoryConfirmed(category) {
      if (!category || this.isReferenceCategory(category)) return false
      return category.confirmed === true || category.confirmed === 1 || category.confirmed === '1' || category.confirmed === 'true'
    },
    isReferenceCategory(category) {
      return category?.is_reference === true || category?.is_reference === 1 || category?.is_reference === '1' || category?.is_reference === 'true'
    },
    selectedProductCategory(categoryKey) {
      return this.tariffCategories.find((category) => category.key === categoryKey) || null
    },
    categoryDescription(categoryKey) {
      const category = this.selectedProductCategory(categoryKey)
      return category ? category.description : ''
    },
    categoryRestrictions(categoryKey) {
      const category = this.selectedProductCategory(categoryKey)
      return category ? category.restrictions : ''
    },
    categoryDetails(categoryKey) {
      const category = this.selectedProductCategory(categoryKey)
      return category ? [category.description, category.restrictions].map((value) => String(value || '').trim()).filter(Boolean).join(' · ') : ''
    },
    productCategoryLabel(categoryKey) {
      const category = this.selectedProductCategory(categoryKey)
      if (!category) return this.calculatorSettings.category_pending_label || 'Por confirmar'
      if (this.isReferenceCategory(category)) return `${this.calculatorSettings.category_reference_label || 'Orientativa'} · ${this.calculatorSettings.category_pending_label || 'tarifa por confirmar'}`
      return this.isCategoryConfirmed(category)
        ? category.label
        : `${category.label} · ${this.calculatorSettings.category_pending_label || 'por confirmar'}`
    },
    productDisplayName(product) {
      const category = this.selectedProductCategory(product.categoryKey)
      return String(product.name || '').trim() || (category ? category.label : 'Producto')
    },
    categoryIllustration(category) {
      const icon = String(category?.icon || '').toLowerCase()
      const icons = {
        clothing: '<svg viewBox="0 0 140 100" fill="none"><ellipse cx="70" cy="89" rx="48" ry="6" fill="#dce6f3"/><path d="m47 14 15-7h16l15 7 18 13-11 18-13-8v31H43V37l-13 8-11-18 28-13Z" fill="#2b83df"/><path d="m62 7 8 10 8-10M70 17v51" stroke="#dcecff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M27 69h38l9 8-2 8H31c-7 0-10-5-4-16Z" fill="#fff" stroke="#d8e0eb" stroke-width="2"/><path d="M73 74h37l8 7-2 7H77c-7 0-10-5-4-14Z" fill="#f7f8fa" stroke="#d8e0eb" stroke-width="2"/><path d="M36 76h24m26 4h22" stroke="#7990ad" stroke-width="2.2" stroke-linecap="round"/></svg>',
        technology: '<svg viewBox="0 0 140 100" fill="none"><ellipse cx="68" cy="89" rx="54" ry="6" fill="#dce6f3"/><path d="M25 17h67a5 5 0 0 1 5 5v43H20V22a5 5 0 0 1 5-5Z" fill="#26384f"/><path d="M27 23h63v35H27z" fill="#52a8f5"/><path d="m27 53 39-30h24v35H27z" fill="#81c5ff" opacity=".72"/><path d="M16 65h85l12 10H8l8-10Z" fill="#bac5d1"/><path d="M49 68h20l4 4H45l4-4Z" fill="#8695a7"/><path d="M104 26c9 0 16 7 16 16v12h-8V42c0-4-3-8-8-8s-8 4-8 8v12h-8V42c0-9 7-16 16-16Z" fill="#27364c"/><rect x="91" y="43" width="9" height="18" rx="4" fill="#25354d"/><rect x="108" y="43" width="9" height="18" rx="4" fill="#25354d"/><path d="M91 58c4 8 10 11 18 9" stroke="#25354d" stroke-width="4" stroke-linecap="round"/></svg>',
        beauty: '<svg viewBox="0 0 140 100" fill="none"><ellipse cx="70" cy="90" rx="48" ry="6" fill="#eadfe4"/><path d="M39 34h31v42a9 9 0 0 1-9 9H48a9 9 0 0 1-9-9V34Z" fill="#f7a6be"/><path d="M46 25h17v9H46zM50 17h9v8h-9z" fill="#bd793f"/><path d="M44 47h21v19H44z" fill="#ffd7e3" opacity=".85"/><path d="M86 50h21v33H86z" fill="#232c39"/><path d="M89 31h15v19H89z" fill="#df315d"/><path d="M92 21h9v10h-9z" fill="#bd793f"/><path d="M89 59h15" stroke="#4e5867" stroke-width="2"/><path d="M47 39h15" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/></svg>',
        home: '<svg viewBox="0 0 140 100" fill="none"><ellipse cx="69" cy="90" rx="56" ry="6" fill="#e8e2d8"/><path d="M24 47a10 10 0 0 1 10-10h52a10 10 0 0 1 10 10v29H24V47Z" fill="#d5bda4"/><path d="M18 53a9 9 0 0 1 9-9h9v34H27a9 9 0 0 1-9-9V53ZM84 44h11a9 9 0 0 1 9 9v16a9 9 0 0 1-9 9H84V44Z" fill="#c8ae94"/><path d="M30 48h55v24H30z" fill="#ebdece"/><path d="M30 76v9m56-9v9" stroke="#8c6b4e" stroke-width="4" stroke-linecap="round"/><path d="M112 25v54m-12-1h24" stroke="#88653e" stroke-width="4" stroke-linecap="round"/><path d="M100 24c2-10 22-10 24 0l-4 14h-16l-4-14Z" fill="#f6d79b"/><path d="M105 37h14" stroke="#d1a863" stroke-width="2"/></svg>',
        package: '<svg viewBox="0 0 140 100" fill="none"><ellipse cx="70" cy="89" rx="42" ry="6" fill="#dce6f3"/><path d="m70 11 38 20v41L70 91 32 72V31l38-20Z" fill="#d9a667"/><path d="m32 31 38 21 38-21M70 52v39M55 19l38 20" stroke="#9a652d" stroke-width="4" stroke-linejoin="round"/><path d="m64 14 12 6-7 4-12-6 7-4Z" fill="#ffcb1b"/></svg>'
      }
      return icons[icon] || icons.package
    },
    openTutorialModal(event) {
      if (!this.tutorialLink || this.tutorialModalOpen) return

      this.tutorialTriggerElement = event?.currentTarget || document.activeElement
      this.tutorialPreviousBodyOverflow = document.body.style.overflow
      this.tutorialModalOpen = true
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', this.handleTutorialModalKeydown)

      this.$nextTick(() => {
        this.$refs.tutorialModalClose?.focus()
      })
    },
    closeTutorialModal() {
      if (!this.tutorialModalOpen) return

      this.tutorialModalOpen = false
      this.cleanupTutorialModal()
      const triggerElement = this.tutorialTriggerElement
      this.tutorialTriggerElement = null

      this.$nextTick(() => {
        if (triggerElement && document.contains(triggerElement)) triggerElement.focus()
      })
    },
    cleanupTutorialModal() {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = this.tutorialPreviousBodyOverflow || ''
      }
      if (typeof window !== 'undefined') {
        window.removeEventListener('keydown', this.handleTutorialModalKeydown)
      }
    },
    handleTutorialModalKeydown(event) {
      if (event.key === 'Escape') {
        event.preventDefault()
        this.closeTutorialModal()
        return
      }

      if (event.key !== 'Tab') return
      const focusable = this.$refs.tutorialModal?.querySelectorAll('button:not([disabled]), a[href], iframe, video[controls]')
      if (!focusable?.length) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    },
    async refreshPageContent() {
      const startedAt = Date.now()

      try {
        const payload = await fetchPage(this.$api)
        if (payload) {
          this.pageContent = normalizePage(payload, POSTALSHOPPER_SOURCE_PAGE)
        }
      } finally {
        const elapsed = Date.now() - startedAt
        const remaining = Math.max(0, 350 - elapsed)

        window.setTimeout(() => {
          this.isBootLoading = false
        }, remaining)
      }
    },
    getSectionSettings(key) {
      const section = this.resolvedPageContent.sections.find((item) => item.key === key)
      return section ? section.settings || {} : {}
    },
    sectionEnabled(key) {
      const section = this.resolvedPageContent.sections.find((item) => item.key === key)
      return !section || section.is_active !== false
    },
    getSectionItems(key) {
      const section = this.resolvedPageContent.sections.find((item) => item.key === key)
      if (!section || !Array.isArray(section.items)) {
        return []
      }
      return section.items
        .filter((item) => item.is_active !== false)
        .map((item) => ({ ...(item.data || {}), id: item.id, type: item.type }))
    },
    formatParcelPrice(value) {
      const amount = Number(String(value == null ? '' : value).replace(',', '.'))
      return Number.isFinite(amount)
        ? amount.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : '0,00'
    },
    formatLimitAmount(value) {
      const amount = Number(value)
      if (!Number.isFinite(amount)) return '0'
      return amount.toLocaleString('es-BO', {
        minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
        maximumFractionDigits: 2
      })
    },
    formatExchangeRate(value) {
      const rate = Number(String(value == null ? '' : value).replace(',', '.'))
      return Number.isFinite(rate) && rate > 0
        ? rate.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 4 })
        : '0,00'
    },
    marketLogoUrl(item) {
      return String(item?.logo || item?.image || item?.logo_url || '').trim()
    },
    brandLogoSvg(label) {
      const value = String(label || '').trim()
      const lower = value.toLowerCase()

      if (lower.includes('amazon')) {
        return '<svg viewBox="0 0 118 36" aria-hidden="true"><text x="4" y="21" font-size="18" font-weight="800" font-family="Arial, sans-serif" fill="currentColor">amazon</text><path d="M28 28c18 7 42 5 61-5" fill="none" stroke="#ffb300" stroke-width="3" stroke-linecap="round"/><path d="M84 21l9 1-5 7" fill="none" stroke="#ffb300" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>'
      }
      if (lower.includes('ebay')) {
        return '<svg viewBox="0 0 96 34" aria-hidden="true"><text x="3" y="24" font-size="22" font-weight="800" font-family="Arial, sans-serif" fill="#e53238">e</text><text x="23" y="24" font-size="22" font-weight="800" font-family="Arial, sans-serif" fill="#0064d2">b</text><text x="43" y="24" font-size="22" font-weight="800" font-family="Arial, sans-serif" fill="#f5af02">a</text><text x="63" y="24" font-size="22" font-weight="800" font-family="Arial, sans-serif" fill="#86b817">y</text></svg>'
      }
      if (lower.includes('walmart')) {
        return '<svg viewBox="0 0 128 34" aria-hidden="true"><text x="3" y="23" font-size="20" font-weight="800" font-family="Arial, sans-serif" fill="#0071ce">Walmart</text><g fill="#ffc220" transform="translate(104 17)"><circle cx="0" cy="-11" r="2.4"/><circle cx="0" cy="11" r="2.4"/><circle cx="-10" cy="-5.5" r="2.4"/><circle cx="10" cy="-5.5" r="2.4"/><circle cx="-10" cy="5.5" r="2.4"/><circle cx="10" cy="5.5" r="2.4"/></g></svg>'
      }
      if (lower.includes('shein')) {
        return '<svg viewBox="0 0 92 34" aria-hidden="true"><text x="4" y="24" font-size="22" font-weight="800" letter-spacing="3" font-family="Arial, sans-serif" fill="#111827">SHEIN</text></svg>'
      }
      if (lower.includes('nike')) {
        return '<svg viewBox="0 0 96 34" aria-hidden="true"><path d="M8 22c16 6 37 1 80-14-33 18-58 25-73 24-7 0-11-3-7-10z" fill="#111827"/></svg>'
      }
      if (lower.includes('apple')) {
        return '<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="#111827" d="M31.4 6.2c1.2-1.5 2-3.6 1.8-5.7-1.8.1-4 .1-5.4 1.8-1.2 1.4-2.2 3.5-1.9 5.5 2 .2 4.2-.5 5.5-1.6zM39 34.4c-.9 2-1.4 2.9-2.6 4.7-1.7 2.6-4.1 5.8-7.1 5.8-2.6 0-3.3-1.7-6.9-1.7s-4.4 1.7-6.9 1.7c-3 0-5.3-2.9-7-5.5-4.8-7.4-5.3-16.1-2.4-20.7 2.1-3.3 5.4-5.2 8.5-5.2 3.2 0 5.2 1.7 7.8 1.7 2.5 0 4.1-1.7 7.8-1.7 2.8 0 5.8 1.5 7.8 4.2-6.9 3.8-5.8 13.6 1 16.7z"/></svg>'
      }
      if (lower.includes('miles')) {
        return '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="19" fill="#ffcc18"/><path d="M24 14v20M14 24h20" stroke="#0f4aad" stroke-width="4" stroke-linecap="round"/></svg>'
      }

      return '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="18" fill="#ffcc18"/><path d="M24 14v20M14 24h20" stroke="#0f4aad" stroke-width="4" stroke-linecap="round"/></svg>'
    },
    brandLogoClass(label) {
      const value = String(label || '').trim().toLowerCase()

      if (value.includes('amazon')) return 'cb-ps-intro__brand-logo cb-ps-intro__brand-logo--amazon'
      if (value.includes('ebay')) return 'cb-ps-intro__brand-logo cb-ps-intro__brand-logo--ebay'
      if (value.includes('walmart')) return 'cb-ps-intro__brand-logo cb-ps-intro__brand-logo--walmart'
      if (value.includes('shein')) return 'cb-ps-intro__brand-logo cb-ps-intro__brand-logo--shein'
      if (value.includes('nike')) return 'cb-ps-intro__brand-logo cb-ps-intro__brand-logo--nike'
      if (value.includes('apple')) return 'cb-ps-intro__brand-logo cb-ps-intro__brand-logo--apple'
      if (value.includes('miles')) return 'cb-ps-intro__brand-logo cb-ps-intro__brand-logo--more'

      return 'cb-ps-intro__brand-logo'
    },
    resolveIcon(icon) {
      return this.icons[icon] || ''
    },
    isInternalRoute(url) {
      return typeof url === 'string' && url.startsWith('/') && !url.startsWith('//')
    },
    linkTarget(url) {
      return /^https?:\/\//i.test(String(url || '').trim()) ? '_blank' : null
    },
    linkRel(url) {
      return this.linkTarget(url) ? 'noopener noreferrer' : null
    },
    linkAttrs(url) {
      if (this.isInternalRoute(url)) {
        return { to: url }
      }
      return { href: url || '#' }
    },
    destinationCardComponent(item) {
      if (!item.url) return 'article'
      return this.isInternalRoute(item.url) ? 'nuxt-link' : 'a'
    },
    destinationCardAttributes(item) {
      if (!item.url) return {}
      if (this.isInternalRoute(item.url)) return { to: item.url }
      return { href: item.url, target: '_blank', rel: 'noopener noreferrer' }
    },
    destinationFlagImage(flag) {
      const value = String(flag || '').trim()
      if (/^https:\/\//i.test(value) || (value.startsWith('/') && !value.startsWith('//'))) return value

      const countryCode = Array.from(value).map((character) => {
        const point = character.codePointAt(0)
        return point >= 0x1f1e6 && point <= 0x1f1ff ? String.fromCharCode(point - 0x1f1e6 + 65) : ''
      }).join('')
      const localFlags = ['US', 'CN', 'ES', 'BR', 'CL', 'AR', 'MX']

      return countryCode.length === 2 && localFlags.includes(countryCode)
        ? `/flags/${countryCode.toLowerCase()}.svg`
        : ''
    },
    destinationCardAriaLabel(item) {
      const status = item.status || 'Próximamente'
      return `${item.label}: ${status}`
    },
    destinationStatusClass(status) {
      return this.isDestinationAvailable(status)
        ? 'cb-ps-destination-card__status cb-ps-destination-card__status--available'
        : 'cb-ps-destination-card__status'
    },
    isDestinationAvailable(status) {
      const value = String(status || '').trim()
      return /\b(disponible|directo|activo|operativo)\b/i.test(value)
        && !/\b(no disponible|inactivo|no operativo)\b/i.test(value)
    }
  },
  head() {
    return {
      title: this.resolvedPageContent.meta_title || '',
      titleTemplate: '%s',
      meta: [{ hid: 'description', name: 'description', content: this.resolvedPageContent.meta_description || '' }],
      htmlAttrs: { lang: 'es' }
    }
  }
}

async function safeGet($api, endpoint) {
  try {
    return await $api.$get(endpoint)
  } catch (error) {
    return null
  }
}

async function fetchPage($api) {
  const endpoints = ['/frontapi/api/site/pages/postalshopper', '/api/site/pages/postalshopper']
  return fetchPageWithSharedLayout($api, endpoints)
}

function normalizePage(payload = {}, base = POSTALSHOPPER_SOURCE_PAGE) {
  const sectionMap = payload.section_map || {}
  const fallbackOnMissing = new Set(['postalshopper_steps', 'postalshopper_calculator'])
  const fallbackMap = base.sections.reduce((accumulator, section) => {
    accumulator[section.key] = section
    return accumulator
  }, {})

  return {
    ...base,
    ...payload,
    theme: {
      ...(base.theme || {}),
      ...sanitizeContentTree(payload.theme || {})
    },
    sections: Object.keys(fallbackMap).map((key, index) => {
      const fallback = fallbackMap[key]
      const section = sectionMap[key] || (Array.isArray(payload.sections) ? payload.sections.find((item) => item.key === key) : null)
      if (!section) {
        const hasServerSections = Boolean(payload.section_map || Array.isArray(payload.sections))
        return hasServerSections && !fallbackOnMissing.has(key)
          ? { ...fallback, is_active: false, items: [] }
          : fallback
      }
      return sanitizeContentTree({
        ...fallback,
        ...section,
        sort_order: typeof section.sort_order === 'number' ? section.sort_order : index,
        settings: {
          ...(fallback.settings || {}),
          ...(section.settings || {})
        },
        items: Array.isArray(section.items) ? section.items : fallback.items
      })
    })
  }
}

function buildIcons() {
  return {
    globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M3 12h18"></path><path d="M12 3a15 15 0 0 1 0 18"></path><path d="M12 3a15 15 0 0 0 0 18"></path></svg>',
    accessibility: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="4" r="1.8"></circle><path d="M7 8h10"></path><path d="M12 8v5"></path><path d="m9 21 3-6 3 6"></path><path d="m8 12 4 2 4-2"></path></svg>',
    help: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M9.1 9a3 3 0 1 1 5.8 1c0 2-3 2-3 4"></path><path d="M12 17h.01"></path></svg>',
    login: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><path d="M10 17l5-5-5-5"></path><path d="M15 12H3"></path></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.5-3.5"></path></svg>',
    star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 2.7 5.47 6.03.88-4.36 4.25 1.03 6.01L12 16.77 6.6 19.61l1.03-6.01L3.27 9.35l6.03-.88L12 3Z"></path></svg>',
    'user-plus': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="7" r="4"></circle><path d="M2 21v-1a7 7 0 0 1 14 0v1M19 8v6M16 11h6"></path></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>',
    cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1"></circle><circle cx="18" cy="20" r="1"></circle><path d="M3 4h3l2.4 10h10.8l2.1-7H7.2"></path></svg>',
    package: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><path d="m12 2 8 4.5v11L12 22 4 17.5v-11L12 2Z"></path><path d="M12 22V11"></path><path d="m20 6.5-8 4.5-8-4.5"></path><path d="m8 4.2 8 4.6"></path></svg>',
    plane: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13"></path><path d="M22 2 15 22l-4-9-9-4 20-7Z"></path></svg>',
    settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.86l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.86-.34 1.7 1.7 0 0 0-1 1.54V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1-1.54 1.7 1.7 0 0 0-1.86.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.86 1.7 1.7 0 0 0-1.54-1H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.54-1 1.7 1.7 0 0 0-.34-1.86l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.86.34h.08a1.7 1.7 0 0 0 1-1.54V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.54 1.7 1.7 0 0 0 1.86-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.86v.08a1.7 1.7 0 0 0 1.54 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.54 1Z"></path></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3Z"></path></svg>',
    spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="m13 2-2 7 4 1-6 12 2-8-4-1 6-11Z"></path></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="M3 7l9 6 9-6"></path></svg>',
    'phone-call': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.34 1.79.64 2.64a2 2 0 0 1-.45 2.11L8 9.91a16 16 0 0 0 6.09 6.09l1.44-1.3a2 2 0 0 1 2.11-.45c.85.3 1.74.52 2.64.64A2 2 0 0 1 22 16.92z"></path></svg>'
  }
}
</script>

<style src="~/assets/css/home.css"></style>
<style src="~/assets/css/postalshopper.css"></style>
