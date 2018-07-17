:<template>
  <div class="listitem">
    {{ item.title }} &mdash;
    <span v-for="label in item.labels" :key="label.id">
      {{label.name}}
    </span>
  </div>
</template>

<script>
export default {
  props: [
    'item'
  ]
}
</script>
