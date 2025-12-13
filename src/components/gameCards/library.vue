<template>
    <div>
        <!-- Game Card - clickable -->
        <div v-if="!placeholderMode" @click="openGameModal" style="cursor: pointer;">
            <img :src="gameData.library_600x900" :alt="'juego ' + gameData.appId" width="100%" class="libraryCard">
        </div>
        <div v-else>
            <p class="placeholder-glow" width="100%">
                <span class="placeholder"></span>
            </p>
        </div>

        <!-- Game Detail Modal -->
        <div class="modal fade" :id="'gameModal' + gameData?.appId" tabindex="-1" aria-hidden="true" ref="gameModal">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content bg-dark text-light" style="overflow: hidden;">
                    <!-- Hero Background Header -->
                    <div class="modal-header p-0 position-relative" :style="{
                        backgroundImage: 'url(' + gameData?.library_hero + ')',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        height: '200px'
                    }">
                        <!-- Gradient overlay -->
                        <div class="w-100 h-100 d-flex align-items-end"
                            style="background: linear-gradient(transparent, rgba(0,0,0,0.8));">
                            <!-- Logo del juego -->
                            <img v-if="gameData?.logo" :src="gameData.logo" alt="Game Logo" class="p-3"
                                style="max-height: 100px; max-width: 300px; object-fit: contain;">
                        </div>
                        <!-- Close button -->
                        <button type="button" class="btn-close btn-close-white position-absolute top-0 end-0 m-3"
                            data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>

                    <!-- Modal Body - Description -->
                    <div class="modal-body">
                        <div v-if="loadingDetails" class="text-center py-4">
                            <div class="spinner-border text-light" role="status">
                                <span class="visually-hidden">Cargando...</span>
                            </div>
                        </div>
                        <div v-else-if="gameDetails">
                            <p class="mb-0">{{ gameDetails.short_description }}</p>
                        </div>
                        <div v-else>
                            <p class="text-muted mb-0">No se pudo cargar la descripción del juego.</p>
                        </div>
                    </div>

                    <!-- Modal Footer -->
                    <div class="modal-footer">
                        <button type="button" class="btn btn-danger" @click="requestRefund">
                            <i class="bi bi-arrow-return-left"></i> Solicitar Reembolso
                        </button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Modal } from 'bootstrap';
import steamDB from '@/services/steamDB.js';

export default {
    name: "libraryCard",
    props: ['gameData'],
    emits: ['refund'],
    data() {
        return {
            modal: null,
            steamDB: new steamDB(),
            gameDetails: null,
            loadingDetails: false
        }
    },
    computed: {
        placeholderMode() {
            return !this.gameData;
        }
    },
    mounted() {
        if (this.gameData) {
            const modalElement = this.$refs.gameModal;
            if (modalElement) {
                this.modal = new Modal(modalElement);
            }
        }
    },
    methods: {
        async openGameModal() {
            if (!this.gameData || !this.modal) return;

            this.loadingDetails = true;
            this.gameDetails = null;

            // Cargar detalles del juego (descripción) desde Steam
            try {
                this.gameDetails = await this.steamDB.importarJuego(this.gameData.appId);
            } catch (error) {
                console.error('Error loading game details:', error);
            } finally {
                this.loadingDetails = false;
            }

            this.modal.show();
        },
        requestRefund() {
            if (confirm("¿Estás seguro de que deseas solicitar un reembolso para este juego?")) {
                this.$emit('refund', this.gameData.appId);
                this.modal.hide();
            }
        }
    }
}
</script>

<style scoped>
.libraryCard {
    box-shadow: 0px 0px 10px 3px rgba(0, 0, 0, 0.3);
    border-radius: 5px;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.libraryCard:hover {
    transform: scale(1.03);
    box-shadow: 0px 0px 15px 5px rgba(100, 149, 237, 0.4);
}

.placeholder-glow {
    aspect-ratio: 2/3;
    background-color: #444;
    border-radius: 5px;
}
</style>
