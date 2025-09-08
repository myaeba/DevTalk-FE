<template>
  <v-list-item
    @click="handleClick"
    class="py-3"
  >
    <template v-slot:prepend>
      <v-avatar size="48" class="mr-3">
        <v-icon size="24" color="grey">mdi-account</v-icon>
      </v-avatar>
    </template>

    <v-list-item-title class="text-subtitle-2 font-weight-medium">
      {{ chat.name }}
    </v-list-item-title>
    <v-list-item-subtitle class="text-body-2 text-grey-darken-1">
      {{ chat.lastMessage }}
    </v-list-item-subtitle>

    <template v-slot:append>
      <div class="d-flex flex-column align-end">
        <span class="text-caption text-grey">{{ chat.time }}</span>
        <v-chip
          v-if="chat.unread"
          size="x-small"
          color="primary"
          class="mt-1"
        >
          {{ chat.unread }}
        </v-chip>
      </div>
    </template>
  </v-list-item>
</template>

<script>
export default {
  name: 'ChatListItem',
  props: {
    chat: {
      type: Object,
      required: true
    }
  },
  methods: {
    handleClick() {
      this.$emit('click', this.chat.id);
    }
  }
}
</script>