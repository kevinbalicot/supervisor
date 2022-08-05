<template>
    <footer class="footer bg-white border-top">
        <div class="container-fluid py-lg-4 py-3 px-3 text-end">
            © {{ new Date().getFullYear() }} {{ projectName }}
            <span class="d-none d-md-inline">- kevinbalicot[at]gmail.com - all rights reserved</span>
        </div>
    </footer>
</template>

<script>
export default {
    inject: ['config'],

    computed: {
        projectName() {
            return this.config.name;
        },


    }
}
</script>
