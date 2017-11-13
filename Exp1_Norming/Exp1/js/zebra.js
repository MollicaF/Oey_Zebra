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
      
      $("#img_prototype").attr("src", "img/" + prototype);
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
        "stim1" : prototype, //prototype
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
  exp.condition = _.sample(["objects", "shapes"]); //can randomize between subject conditions here
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

var prototype="Draw_white_0.svg"

var stimuli_images = [
  "Draw_black_1.svg",
  "Draw_black_10.svg",
  "Draw_black_13.svg",
  "Draw_black_16.svg",
  "Draw_black_17.svg",
  "Draw_black_20.svg",
  "Draw_black_23.svg",
  "Draw_black_27.svg",
  "Draw_black_28.svg",
  "Draw_black_3.svg",
  "Draw_black_31.svg",
  "Draw_black_32.svg",
  "Draw_black_34.svg",
  "Draw_black_39.svg",
  "Draw_black_43.svg",
  "Draw_black_44.svg",
  "Draw_black_45.svg",
  "Draw_black_47.svg",
  "Draw_black_5.svg",
  "Draw_black_50.svg",
  "Draw_black_51.svg",
  "Draw_black_52.svg",
  "Draw_black_53.svg",
  "Draw_black_54.svg",
  "Draw_black_55.svg",
  "Draw_black_57.svg",
  "Draw_black_59.svg",
  "Draw_black_60.svg",
  "Draw_black_62.svg",
  "Draw_black_63.svg",
  "Draw_black_64.svg",
  "Draw_black_65.svg",
  "Draw_black_66.svg",
  "Draw_black_67.svg",
  "Draw_black_68.svg",
  "Draw_black_69.svg",
  "Draw_black_71.svg",
  "Draw_black_74.svg",
  "Draw_black_75.svg",
  "Draw_black_77.svg",
  "Draw_black_79.svg",
  "Draw_black_80.svg",
  "Draw_black_85.svg",
  "Draw_black_86.svg",
  "Draw_black_87.svg",
  "Draw_black_90.svg",
  "Draw_black_95.svg",
  "Draw_black_99.svg",
  "Draw_white_0.svg",
  "Draw_white_11.svg",
  "Draw_white_12.svg",
  "Draw_white_14.svg",
  "Draw_white_15.svg",
  "Draw_white_18.svg",
  "Draw_white_19.svg",
  "Draw_white_2.svg",
  "Draw_white_21.svg",
  "Draw_white_22.svg",
  "Draw_white_24.svg",
  "Draw_white_25.svg",
  "Draw_white_26.svg",
  "Draw_white_29.svg",
  "Draw_white_30.svg",
  "Draw_white_33.svg",
  "Draw_white_35.svg",
  "Draw_white_36.svg",
  "Draw_white_37.svg",
  "Draw_white_38.svg",
  "Draw_white_4.svg",
  "Draw_white_40.svg",
  "Draw_white_41.svg",
  "Draw_white_42.svg",
  "Draw_white_46.svg",
  "Draw_white_48.svg",
  "Draw_white_49.svg",
  "Draw_white_56.svg",
  "Draw_white_58.svg",
  "Draw_white_6.svg",
  "Draw_white_61.svg",
  "Draw_white_7.svg",
  "Draw_white_70.svg",
  "Draw_white_72.svg",
  "Draw_white_73.svg",
  "Draw_white_76.svg",
  "Draw_white_78.svg",
  "Draw_white_8.svg",
  "Draw_white_81.svg",
  "Draw_white_82.svg",
  "Draw_white_83.svg",
  "Draw_white_84.svg",
  "Draw_white_88.svg",
  "Draw_white_89.svg",
  "Draw_white_9.svg",
  "Draw_white_91.svg",
  "Draw_white_92.svg",
  "Draw_white_93.svg",
  "Draw_white_94.svg",
  "Draw_white_96.svg",
  "Draw_white_97.svg",
  "Draw_white_98.svg",
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



