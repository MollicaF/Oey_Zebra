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
      var instr_sample_order = sample_without_replacement(instr_sample_size, stimuli_images);
      for(var i=0; i<instr_sample_size; i++){
        $('#img_example'+i).attr("src", "img/" + instr_sample_order[i]);
      }
    },

    button : function() {
      exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  });

  slides.trial = slide({
    name : "trial",

    /* trial information for this block
     (the variable 'stim' will change between each of these values,
      and for each of these, present_handle will be run.) */

    present : _.shuffle(prototype_images),


    //this gets run only at the beginning of the block
    present_handle : function(stim) {
      $(".err").hide();
      $('.feedback').hide();
      $('input:radio').attr("checked", false);
      var fep = "fep";
      var fep_txt = fep.italics();
      this.statement = _.sample([
        "This is a " + fep_txt + ":",
        "Here is a " + fep_txt + ":",
        "Look! It's a " + fep_txt + ":",
        "Check out this " + fep_txt + ":",
        "Here is an example of a " + fep_txt + ":",
        "It's a " + fep_txt + ":",
      ]);
      $("#fep_statement").text("");
      $("#fep_statement").append(this.statement);
      $("#example"+stimIndex).attr("src", "img/" + stim);
      stimIndex = stimIndex + 1;

      
      var test_object_order = _.shuffle(test_images);
      for(var i=0; i<test_object_order.length; i++){
        $('#test'+i).attr("src", "img/" + test_object_order[i]);
      }

    },

    button : function() {
      var ready = false;
      if($('input[type=radio]:checked').size() < test_images.length){
        $(".err").show();
      } else {
        var incorrectNum = 0;
        for(var i=0; i<exp.test_images_len; i++){
          if(feps.indexOf($('#test'+i).attr('src')) < 0){
            if($('input[name="testq0"]:checked').val() == "yes"){
              $('#feedback'+i).show();
              incorrectNum++;
            }
          }
          else{
            if($('input[name="testq0"]:checked').val() == "no"){
              $('#feedback'+i).show();
              incorrectNum++;
            }
          }
        }

        this.log_responses();

        /* use _stream.apply(this); if and only if there is
        "present" data. (and only *after* responses are logged) */
        //setTimeout(this.delay_cont, 100);
        _stream.apply(this);
        //_.delay(delay_cont, 10000);
      }
    },

    delay_cont : function() {
      _stream.apply(this);
    },

    log_responses : function() {
      exp.data_trials.push({
        "trial_type" : "trial",
        "stim" : $('#example'+(stimIndex-1)).attr('src'), //presented exemplar
        "test0" : $('#test0').attr('src'),
        "response0" : $('input[name="testq0"]:checked').val(),
        "test1" : $('#test1').attr('src'),
        "response1" : $('input[name="testq1"]:checked').val(),
        "test2" : $('#test2').attr('src'),
        "response2" : $('input[name="testq2"]:checked').val(),
        "test3" : $('#test3').attr('src'),
        "response3" : $('input[name="testq3"]:checked').val(),
        "test4" : $('#test4').attr('src'),
        "response4" : $('input[name="testq4"]:checked').val(),
        "test5" : $('#test5').attr('src'),
        "response5" : $('input[name="testq5"]:checked').val(),
        "test6" : $('#test6').attr('src'),
        "response6" : $('input[name="testq6"]:checked').val(),
        "test7" : $('#test7').attr('src'),
        "response7" : $('input[name="testq7"]:checked').val(),
        "test8" : $('#test8').attr('src'),
        "response8" : $('input[name="testq8"]:checked').val(),
        "test9" : $('#test9').attr('src'),
        "response9" : $('input[name="testq9"]:checked').val(),
        "test10" : $('#test10').attr('src'),
        "response10" : $('input[name="testq10"]:checked').val(),
        "test11" : $('#test11').attr('src'),
        "response11" : $('input[name="testq11"]:checked').val()
      });
    }
  });

  slides.description_instruction = slide({
    name: "description_instruction",

    button : function() {
      exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  });

  slides.description = slide({
    name : "description",

    start : function() {
      $(".err").hide();
    },

    button : function() {
      if($('#text_description').val() == ""){
        $(".err").show();
      }
      else{
        this.log_responses();
        exp.go();
      }
    },

    log_responses : function() {
      exp.ling_description.push({
        desc_response : $('#text_description').val()
      })
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
          "ling_description" : exp.ling_description,
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
  //exp.condition = _.sample(["objects", "shapes"]); //can randomize between subject conditions here
  exp.system = {
      Browser : BrowserDetect.browser,
      OS : BrowserDetect.OS,
      screenH: screen.height,
      screenUH: exp.height,
      screenW: screen.width,
      screenUW: exp.width
    };

  //blocks of the experiment:
  exp.structure=["i0", "instructions", "trial", "description_instruction", "description", "subj_info", "thanks"];

  exp.data_trials = [];
  //make corresponding slides:

  //exp.prototypes = sample_without_replacement(exp.prototypes_len, prototype_images);
  //exp.test_images = sample_without_replacement(exp.test_images_len, stimuli_images);

  exp.slides = make_slides(exp);
  exp.nQs = utils.get_exp_length(); //this does not work if there are stacks of stims (but does work for an experiment with this structure)
                    //relies on structure and slides being defined

  exp.test_images_len = 10;

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

var stimIndex = 0;

var prototype_images = [
  "EdgePrototype_white_1.svg",
  "Draw_white_0.svg",
  "Draw_white_11.svg",
  "Draw_white_33.svg",
  "Draw_white_31.svg",
  "Draw_white_44.svg",
  "Draw_white_28.svg",
]

var test_images = [
  "Draw_white_19.svg",  //shape = similar, fill = white
  "Draw_white_21.svg",  //shape = similar, fill = white
  "Draw_white_28.svg",  //shape = similar, fill = white
  "Draw_black_15.svg",  //shape = similar, fill = black
  "Draw_black_16.svg",  //shape = similar, fill = black
  "Draw_black_44.svg",  //shape = similar, fill = black
  "Draw_white_29.svg",  //shape = dissimilar, fill = white
  "Draw_white_43.svg",  //shape = dissimilar, fill = white
  "Draw_white_10.svg",  //shape = dissimilar, fill = white
  "Draw_black_23.svg",  //shape = dissimilar, fill = black
]

var feps = [
  "img/EdgePrototype_white_1.svg",
  "img/Draw_white_15.svg",
  "img/Draw_white_19.svg",
  "img/MidPrototype_white_1.svg",
  "img/Draw_white_0.svg",
  "img/Draw_white_6.svg",
  "img/Draw_white_39.svg",
  "img/Draw_white_7.svg",
  "img/Draw_white_11.svg",
  "img/Draw_white_21.svg",
  "img/Draw_white_9.svg",
  "img/Draw_white_17.svg",
  "img/Draw_white_33.svg",
  "img/Draw_white_34.svg",
  "img/Draw_white_27.svg",
  "img/Draw_white_30.svg",
  "img/Draw_white_31.svg",
  "img/Draw_white_2.svg",
  "img/Draw_white_28.svg",
  "img/Draw_white_49.svg",
  "img/Draw_white_44.svg",
  "img/Draw_white_32.svg",
  "img/Draw_white_35.svg",
]

var stimuli_images = [
  "Draw_white_0.svg",
  "Draw_white_1.svg",
  "Draw_white_10.svg",
  "Draw_white_11.svg",
  "Draw_white_12.svg",
  "Draw_white_13.svg",
  "Draw_white_14.svg",
  "Draw_white_15.svg",
  "Draw_white_16.svg",
  "Draw_white_17.svg",
  "Draw_white_18.svg",
  "Draw_white_19.svg",
  "Draw_white_2.svg",
  "Draw_white_20.svg",
  "Draw_white_21.svg",
  "Draw_white_22.svg",
  "Draw_white_23.svg",
  "Draw_white_24.svg",
  "Draw_white_26.svg",
  "Draw_white_27.svg",
  "Draw_white_28.svg",
  "Draw_white_29.svg",
  "Draw_white_3.svg",
  "Draw_white_30.svg",
  "Draw_white_31.svg",
  "Draw_white_32.svg",
  "Draw_white_33.svg",
  "Draw_white_34.svg",
  "Draw_white_35.svg",
  "Draw_white_37.svg",
  "Draw_white_38.svg",
  "Draw_white_39.svg",
  "Draw_white_4.svg",
  "Draw_white_41.svg",
  "Draw_white_42.svg",
  "Draw_white_43.svg",
  "Draw_white_44.svg",
  "Draw_white_45.svg",
  "Draw_white_46.svg",
  "Draw_white_48.svg",
  "Draw_white_49.svg",
  "Draw_white_5.svg",
  "Draw_white_6.svg",
  "Draw_white_7.svg",
  "Draw_white_9.svg",
  "MidPrototype_white_1.svg",
  "MidPrototype_white_2.svg",
  "EdgePrototype_white_1.svg",
  "EdgePrototype_white_2.svg",
  "EdgePrototype_white_3.svg",
  "Draw_black_0.svg",
  "Draw_black_1.svg",
  "Draw_black_10.svg",
  "Draw_black_11.svg",
  "Draw_black_12.svg",
  "Draw_black_13.svg",
  "Draw_black_14.svg",
  "Draw_black_15.svg",
  "Draw_black_16.svg",
  "Draw_black_17.svg",
  "Draw_black_18.svg",
  "Draw_black_19.svg",
  "Draw_black_2.svg",
  "Draw_black_20.svg",
  "Draw_black_21.svg",
  "Draw_black_22.svg",
  "Draw_black_23.svg",
  "Draw_black_24.svg",
  "Draw_black_26.svg",
  "Draw_black_27.svg",
  "Draw_black_28.svg",
  "Draw_black_29.svg",
  "Draw_black_3.svg",
  "Draw_black_30.svg",
  "Draw_black_31.svg",
  "Draw_black_32.svg",
  "Draw_black_33.svg",
  "Draw_black_34.svg",
  "Draw_black_35.svg",
  "Draw_black_37.svg",
  "Draw_black_38.svg",
  "Draw_black_39.svg",
  "Draw_black_4.svg",
  "Draw_black_41.svg",
  "Draw_black_42.svg",
  "Draw_black_43.svg",
  "Draw_black_44.svg",
  "Draw_black_45.svg",
  "Draw_black_46.svg",
  "Draw_black_48.svg",
  "Draw_black_49.svg",
  "Draw_black_5.svg",
  "Draw_black_6.svg",
  "Draw_black_7.svg",
  "Draw_black_9.svg",
  "MidPrototype_black_1.svg",
  "MidPrototype_black_2.svg",
  "EdgePrototype_black_1.svg",
  "EdgePrototype_black_2.svg",
  "EdgePrototype_black_3.svg",
]

function sample_without_replacement(sampleSize, sample){
  var urn = sample.slice(0);
  var return_sample = [];
  for(var i=0; i<sampleSize; i++){
    var randomIndex = Math.floor(Math.random()*urn.length);
    return_sample.push(urn.splice(randomIndex, 1)[0]);
  }
  return return_sample;
}



