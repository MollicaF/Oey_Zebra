function make_slides(f) {
  var   slides = {};

  slides.i0 = slide({
     name : "i0",
     start: function() {
      exp.startT = Date.now();
     }
  });

  slides.instructions = slide({
    name : "instructions",

    start : function(){
      var instr_sample_size = 8; //number of sample stimuli seen in instructions
      var instr_sample_order = sample_without_replacement(instr_sample_size);
      for(var i=0; i<instr_sample_size; i++){
        $('#img_example'+i).attr("src", "img/" + instr_sample_order[i]);
      }
    },

    button : function() {
      exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  });

  slides.one_slider = slide({
    name : "one_slider",

    /* trial information for this block
     (the variable 'stim' will change between each of these values,
      and for each of these, present_handle will be run.) */

    present: sample_without_replacement(stimuli_images.length),

    //this gets run only at the beginning of the block
    present_handle : function(stim) {
      $(".err").hide();

      this.stim = stim; //I like to store this information in the slide so I can record it later.
      
      $("#img_comparison").attr("src", "img/" + stim);

      this.init_sliders();
      exp.sliderPost = null; //erase current slider value
    },

    button : function() {
      if (exp.sliderPost == null) {
        $(".err").show();
      } else {
        this.log_responses();

        /* use _stream.apply(this); if and only if there is
        "present" data. (and only *after* responses are logged) */
        _stream.apply(this);
      }
    },

    init_sliders : function() {
      utils.make_slider("#single_slider", function(event, ui) {
        exp.sliderPost = ui.value;
      });
    },

    log_responses : function() {
      exp.data_trials.push({
        "trial_type" : "one_slider",
        "stim1" : "Draw_White_0.svg", //prototype
        "stim2" : this.stim,
        "response" : exp.sliderPost
      });
    }
  });

  

  slides.subj_info =  slide({
    name : "subj_info",
    submit : function(e){
      //if (e.preventDefault) e.preventDefault(); // I don't know what this means.
      exp.subj_data = {
        language : $("#language").val(),
        enjoyment : $("#enjoyment").val(),
        asses : $('input[name="assess"]:checked').val(),
        age : $("#age").val(),
        gender : $("#gender").val(),
        education : $("#education").val(),
        comments : $("#comments").val(),
        problems: $("#problems").val(),
        fairprice: $("#fairprice").val()
      };
      exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  });

  slides.thanks = slide({
    name : "thanks",
    start : function() {
      exp.data= {
          "trials" : exp.data_trials,
          "catch_trials" : exp.catch_trials,
          "system" : exp.system,
          "condition" : exp.condition,
          "subject_information" : exp.subj_data,
          "time_in_minutes" : (Date.now() - exp.startT)/60000
      };
      setTimeout(function() {turk.submit(exp.data);}, 1000);
    }
  });

  return slides;
}


/// init ///
function init() {
  exp.trials = [];
  exp.catch_trials = [];
  exp.condition = _.sample(["CONDITION 1", "condition 2"]); //can randomize between subject conditions here
  exp.system = {
      Browser : BrowserDetect.browser,
      OS : BrowserDetect.OS,
      screenH: screen.height,
      screenUH: exp.height,
      screenW: screen.width,
      screenUW: exp.width
    };
  //blocks of the experiment:
  exp.structure=["i0", "instructions", "one_slider", "subj_info", "thanks"];

  exp.data_trials = [];
  //make corresponding slides:
  exp.slides = make_slides(exp);

  exp.nQs = utils.get_exp_length(); //this does not work if there are stacks of stims (but does work for an experiment with this structure)
                    //relies on structure and slides being defined

  $('.slide').hide(); //hide everything

  //make sure turkers have accepted HIT (or you're not in mturk)
  $("#start_button").click(function() {
    if (turk.previewMode) {
      $("#mustaccept").show();
    } else {
      $("#start_button").click(function() {$("#mustaccept").show();});
      exp.go();
    }
  });

  exp.go(); //show first slide
}

var stimuli_images = [
  "Draw_Black_0.svg",
  "Draw_Black_1.svg",
  "Draw_Black_10.svg",
  "Draw_Black_11.svg",
  "Draw_Black_12.svg",
  "Draw_Black_13.svg",
  "Draw_Black_14.svg",
  "Draw_Black_15.svg",
  "Draw_Black_16.svg",
  "Draw_Black_17.svg",
  "Draw_Black_18.svg",
  "Draw_Black_19.svg",
  "Draw_Black_2.svg",
  "Draw_Black_20.svg",
  "Draw_Black_21.svg",
  "Draw_Black_22.svg",
  "Draw_Black_23.svg",
  "Draw_Black_24.svg",
  "Draw_Black_25.svg",
  "Draw_Black_26.svg",
  "Draw_Black_27.svg",
  "Draw_Black_28.svg",
  "Draw_Black_29.svg",
  "Draw_Black_3.svg",
  "Draw_Black_30.svg",
  "Draw_Black_31.svg",
  "Draw_Black_32.svg",
  "Draw_Black_33.svg",
  "Draw_Black_34.svg",
  "Draw_Black_35.svg",
  "Draw_Black_36.svg",
  "Draw_Black_37.svg",
  "Draw_Black_38.svg",
  "Draw_Black_39.svg",
  "Draw_Black_4.svg",
  "Draw_Black_40.svg",
  "Draw_Black_41.svg",
  "Draw_Black_42.svg",
  "Draw_Black_43.svg",
  "Draw_Black_44.svg",
  "Draw_Black_45.svg",
  "Draw_Black_46.svg",
  "Draw_Black_47.svg",
  "Draw_Black_48.svg",
  "Draw_Black_49.svg",
  "Draw_Black_5.svg",
  "Draw_Black_50.svg",
  "Draw_Black_51.svg",
  "Draw_Black_52.svg",
  "Draw_Black_53.svg",
  "Draw_Black_54.svg",
  "Draw_Black_55.svg",
  "Draw_Black_56.svg",
  "Draw_Black_57.svg",
  "Draw_Black_58.svg",
  "Draw_Black_59.svg",
  "Draw_Black_6.svg",
  "Draw_Black_60.svg",
  "Draw_Black_61.svg",
  "Draw_Black_62.svg",
  "Draw_Black_63.svg",
  "Draw_Black_64.svg",
  "Draw_Black_65.svg",
  "Draw_Black_66.svg",
  "Draw_Black_67.svg",
  "Draw_Black_68.svg",
  "Draw_Black_69.svg",
  "Draw_Black_7.svg",
  "Draw_Black_70.svg",
  "Draw_Black_71.svg",
  "Draw_Black_72.svg",
  "Draw_Black_73.svg",
  "Draw_Black_74.svg",
  "Draw_Black_75.svg",
  "Draw_Black_76.svg",
  "Draw_Black_77.svg",
  "Draw_Black_78.svg",
  "Draw_Black_79.svg",
  "Draw_Black_8.svg",
  "Draw_Black_80.svg",
  "Draw_Black_81.svg",
  "Draw_Black_82.svg",
  "Draw_Black_83.svg",
  "Draw_Black_84.svg",
  "Draw_Black_85.svg",
  "Draw_Black_86.svg",
  "Draw_Black_87.svg",
  "Draw_Black_88.svg",
  "Draw_Black_89.svg",
  "Draw_Black_9.svg",
  "Draw_Black_90.svg",
  "Draw_Black_91.svg",
  "Draw_Black_92.svg",
  "Draw_Black_93.svg",
  "Draw_Black_94.svg",
  "Draw_Black_95.svg",
  "Draw_Black_96.svg",
  "Draw_Black_97.svg",
  "Draw_Black_98.svg",
  "Draw_Black_99.svg",
  "Draw_White_0.svg",
  "Draw_White_1.svg",
  "Draw_White_10.svg",
  "Draw_White_11.svg",
  "Draw_White_12.svg",
  "Draw_White_13.svg",
  "Draw_White_14.svg",
  "Draw_White_15.svg",
  "Draw_White_16.svg",
  "Draw_White_17.svg",
  "Draw_White_18.svg",
  "Draw_White_19.svg",
  "Draw_White_2.svg",
  "Draw_White_20.svg",
  "Draw_White_21.svg",
  "Draw_White_22.svg",
  "Draw_White_23.svg",
  "Draw_White_24.svg",
  "Draw_White_25.svg",
  "Draw_White_26.svg",
  "Draw_White_27.svg",
  "Draw_White_28.svg",
  "Draw_White_29.svg",
  "Draw_White_3.svg",
  "Draw_White_30.svg",
  "Draw_White_31.svg",
  "Draw_White_32.svg",
  "Draw_White_33.svg",
  "Draw_White_34.svg",
  "Draw_White_35.svg",
  "Draw_White_36.svg",
  "Draw_White_37.svg",
  "Draw_White_38.svg",
  "Draw_White_39.svg",
  "Draw_White_4.svg",
  "Draw_White_40.svg",
  "Draw_White_41.svg",
  "Draw_White_42.svg",
  "Draw_White_43.svg",
  "Draw_White_44.svg",
  "Draw_White_45.svg",
  "Draw_White_46.svg",
  "Draw_White_47.svg",
  "Draw_White_48.svg",
  "Draw_White_49.svg",
  "Draw_White_5.svg",
  "Draw_White_50.svg",
  "Draw_White_51.svg",
  "Draw_White_52.svg",
  "Draw_White_53.svg",
  "Draw_White_54.svg",
  "Draw_White_55.svg",
  "Draw_White_56.svg",
  "Draw_White_57.svg",
  "Draw_White_58.svg",
  "Draw_White_59.svg",
  "Draw_White_6.svg",
  "Draw_White_60.svg",
  "Draw_White_61.svg",
  "Draw_White_62.svg",
  "Draw_White_63.svg",
  "Draw_White_64.svg",
  "Draw_White_65.svg",
  "Draw_White_66.svg",
  "Draw_White_67.svg",
  "Draw_White_68.svg",
  "Draw_White_69.svg",
  "Draw_White_7.svg",
  "Draw_White_70.svg",
  "Draw_White_71.svg",
  "Draw_White_72.svg",
  "Draw_White_73.svg",
  "Draw_White_74.svg",
  "Draw_White_75.svg",
  "Draw_White_76.svg",
  "Draw_White_77.svg",
  "Draw_White_78.svg",
  "Draw_White_79.svg",
  "Draw_White_8.svg",
  "Draw_White_80.svg",
  "Draw_White_81.svg",
  "Draw_White_82.svg",
  "Draw_White_83.svg",
  "Draw_White_84.svg",
  "Draw_White_85.svg",
  "Draw_White_86.svg",
  "Draw_White_87.svg",
  "Draw_White_88.svg",
  "Draw_White_89.svg",
  "Draw_White_9.svg",
  "Draw_White_90.svg",
  "Draw_White_91.svg",
  "Draw_White_92.svg",
  "Draw_White_93.svg",
  "Draw_White_94.svg",
  "Draw_White_95.svg",
  "Draw_White_96.svg",
  "Draw_White_97.svg",
  "Draw_White_98.svg",
  "Draw_White_99.svg",
]

function sample_without_replacement(sampleSize){
  var urn = stimuli_images.slice(0);
  var return_sample = [];
  for(var i=0; i<sampleSize; i++){
    var randomIndex = Math.floor(Math.random()*urn.length);
    return_sample.push(urn.splice(randomIndex, 1)[0]);
  }
  return return_sample;
}



