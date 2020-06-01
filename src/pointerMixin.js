export default {
  data () {
    return {
      pointer: null,
      pointerDirty: false
    }
  },
  props: {
    /**
     * Enable/disable highlighting of the pointed value.
     * @type {Boolean}
     * @default true
     */
    showPointer: {
      type: Boolean,
      default: true
    },
    optionHeight: {
      type: Number,
      default: 40
    }
  },
  computed: {
    pointerPosition () {
      if (this.pointer !== null) {
        this.pointer * this.optionHeight
      }
      return 0
    },
    visibleElements () {
      return this.optimizedHeight / this.optionHeight
    }
  },
  watch: {
    // filteredOptions () {
    //   this.pointerAdjust()
    // },
    isOpen () {
      this.pointerDirty = false
    },
    pointer () {
      if (this.$refs.search && this.pointer !== null) this.$refs.search.setAttribute('aria-activedescendant', this.id + '-' + this.pointer.toString())
    }
  },
  methods: {
    optionHighlight (index, option) {
      return {
        'multiselect__option--highlight': index === this.pointer && this.showPointer,
        'multiselect__option--selected': this.isSelected(option)
      }
    },
    groupHighlight (index, selectedGroup) {
      if (!this.groupSelect) {
        return [
          'multiselect__option--disabled',
          { 'multiselect__option--group': selectedGroup.$isLabel }
        ]
      }

      const group = this.options.find(option => {
        return option[this.groupLabel] === selectedGroup.$groupLabel
      })

      return group && !this.wholeGroupDisabled(group) ? [
        'multiselect__option--group',
        { 'multiselect__option--highlight': index === this.pointer && this.showPointer },
        { 'multiselect__option--group-selected': this.wholeGroupSelected(group) }
      ] : 'multiselect__option--disabled'
    },
    addPointerElement ({ key } = 'Enter') {
      /* istanbul ignore else */
      if (this.filteredOptions.length > 0) {
        if (this.pointer !== null) {
          this.select(this.filteredOptions[this.pointer], key)
        } else this.deactivate()
      }
      this.pointerReset()
    },
    pointerForward () {
      if (this.pointer === null) {
        this.pointer = 0
      }
      /* istanbul ignore else */
      if (this.pointer < this.filteredOptions.length - 1) {
        this.pointer++
        /* istanbul ignore next */
        if (this.$refs.list.scrollTop <= this.pointerPosition - (this.visibleElements - 1) * this.optionHeight) {
          this.$refs.list.scrollTop = this.pointerPosition - (this.visibleElements - 1) * this.optionHeight
        }
        /* istanbul ignore else */
        if (
          this.filteredOptions[this.pointer] &&
          this.filteredOptions[this.pointer].$isLabel &&
          !this.groupSelect
        ) this.pointerForward()
      }
      this.pointerDirty = true
    },
    pointerBackward () {
      if (this.pointer === null) {
        this.pointer = 0
      }
      if (this.pointer > 0) {
        this.pointer--
        /* istanbul ignore else */
        if (this.$refs.list.scrollTop >= this.pointerPosition) {
          this.$refs.list.scrollTop = this.pointerPosition
        }
        /* istanbul ignore else */
        if (this.pointer !== null) {
          if (
            this.filteredOptions[this.pointer] &&
            this.filteredOptions[this.pointer].$isLabel &&
            !this.groupSelect
          ) this.pointerBackward()
        }
      } else {
        /* istanbul ignore else */
        if (this.pointer !== null) {
          if (
            this.filteredOptions[this.pointer] &&
            this.filteredOptions[0].$isLabel &&
            !this.groupSelect
          ) this.pointerForward()
        }
      }
      this.pointerDirty = true
    },
    pointerReset () {
      /* istanbul ignore else */
      if (!this.closeOnSelect) return
      this.pointer = null
      /* istanbul ignore else */
      if (this.$refs.list) {
        this.$refs.list.scrollTop = 0
      }
    },
    pointerAdjust () {
      if (this.pointer === null) {
        this.pointer = 0
      } else {
        /* istanbul ignore else */
        if (this.pointer >= this.filteredOptions.length - 1) {
          this.pointer = this.filteredOptions.length
            ? this.filteredOptions.length - 1
            : 0
        }

        if (this.filteredOptions.length > 0 &&
          this.filteredOptions[this.pointer].$isLabel &&
          !this.groupSelect
        ) {
          this.pointerForward()
        }
      }
    },
    pointerSet (index) {
      this.pointer = index
      this.pointerDirty = true
    }
  }
}
