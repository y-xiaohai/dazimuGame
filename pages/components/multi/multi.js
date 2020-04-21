Component({

  properties: {

  },

  data: {

  },

  methods: {
    formSubmit: function(e) {
      if (e.detail.formId != 'the formId is a mock one') {
        this.setData({
          formIdString: e.detail.formId + "," + this.data.formIdString
        })
      }
      console.log(this.data.formIdString)
    }
  }
})