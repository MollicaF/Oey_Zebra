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
      for(var j=0; j<prototype_images.length; j++){
        remove(stimuli_images, prototype_images[j]);
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
      $('.feedback').css("opacity", 0);
      $('.feedback').css("left", "0px");
      $('.feedback').data("correct", "NA");
      $('.feedback').data("order", -1);
      $('input:radio').attr("checked", false);
      $('input:radio').attr("disabled", false);
      $("#example"+stimIndex).attr("src", "img/" + stim);
      stimIndex = stimIndex + 1;
    
      var test_object_order = sample_without_replacement(exp.test_images_len, stimuli_images);
      for(var i=0; i<test_object_order.length; i++){
        $('#test'+i).attr("src", "img/" + test_object_order[i]);
        if(jQuery.inArray(test_object_order[i], feps) !== -1){
          $('#radioq'+i).data("fep", "yes");
        } else {
          $('#radioq'+i).data("fep", "no");
        }
        remove(stimuli_images, test_object_order[i]);
      }
      this.t0 = performance.now();
    },

    button : function() {
      var ready = false;
      if($('input[type=radio]:checked').size() < exp.test_images_len){
        $(".err").show();
      } else {
        this.t1 = performance.now();
        this.log_responses();

        /* use _stream.apply(this); if and only if there is
        "present" data. (and only *after* responses are logged) */
        _stream.apply(this);
      }
    },

    log_responses : function() {
      exp.data_trials.push({
        "trial_type" : "trial",
        "stim" : $('#example'+(stimIndex-1)).attr('src'), //presented exemplar
        "test0" : $('#test0').attr('src'),
        "fep0": $('#radioq0').data("fep"),
        "response0" : $('input[name="testq0"]:checked').val(),
        "correct0" : $('#feedback0').data("correct"),
        "order0": $('#feedback0').data("order"),
        "test1" : $('#test1').attr('src'),
        "fep1": $('#radioq1').data("fep"),
        "response1" : $('input[name="testq1"]:checked').val(),
        "correct1" : $('#feedback1').data("correct"),
        "order1": $('#feedback1').data("order"),
        "test2" : $('#test2').attr('src'),
        "fep2": $('#radioq2').data("fep"),
        "response2" : $('input[name="testq2"]:checked').val(),
        "correct2" : $('#feedback2').data("correct"),
        "order2": $('#feedback2').data("order"),
        "test3" : $('#test3').attr('src'),
        "fep3": $('#radioq3').data("fep"),
        "response3" : $('input[name="testq3"]:checked').val(),
        "correct3" : $('#feedback3').data("correct"),
        "order3": $('#feedback3').data("order"),
        "test4" : $('#test4').attr('src'),
        "fep4": $('#radioq4').data("fep"),
        "response4" : $('input[name="testq4"]:checked').val(),
        "correct4" : $('#feedback4').data("correct"),
        "order4": $('#feedback4').data("order"),
        "test5" : $('#test5').attr('src'),
        "fep5": $('#radioq5').data("fep"),
        "response5" : $('input[name="testq5"]:checked').val(),
        "correct5" : $('#feedback5').data("correct"),
        "order5": $('#feedback5').data("order"),
        "test6" : $('#test6').attr('src'),
        "fep6": $('#radioq6').data("fep"),
        "response6" : $('input[name="testq6"]:checked').val(),
        "correct6" : $('#feedback6').data("correct"),
        "order6": $('#feedback6').data("order"),
        "test7" : $('#test7').attr('src'),
        "fep7": $('#radioq7').data("fep"),
        "response7" : $('input[name="testq7"]:checked').val(),
        "correct7" : $('#feedback7').data("correct"),
        "order7": $('#feedback7').data("order"),
        "test8" : $('#test8').attr('src'),
        "fep8": $('#radioq8').data("fep"),
        "response8" : $('input[name="testq8"]:checked').val(),
        "correct8" : $('#feedback8').data("correct"),
        "order8": $('#feedback8').data("order"),
        "test9" : $('#test9').attr('src'),
        "fep9": $('#radioq9').data("fep"),
        "response9" : $('input[name="testq9"]:checked').val(),
        "correct9" : $('#feedback9').data("correct"),
        "order9": $('#feedback9').data("order"),
        "trialTime" : this.t1 - this.t0,
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
      this.t0 = performance.now();
    },

    button : function() {
      if($('#text_description').val() == ""){
        $(".err").show();
      }
      else{
        this.t1 = performance.now();
        exp.ling_description = {
          "desc_response" : $('#text_description').val(),
          "trialTime" : this.t1 - this.t0
        };

        exp.go();
      }
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

  for(var j=0; j<prototype_images.length; j++){
    remove(stimuli_images, prototype_images[j]);
  }

  exp.go(); //show first slide
}

var stimIndex = 0;

var prototype_images = [
  "EdgePrototype_white_1.svg",
  "Draw_white_0.svg",
  "Draw_white_11.svg",
  "Draw_white_33.svg",
  "Draw_white_44.svg",
  "Draw_white_28.svg",
]

var feps = [
  "EdgePrototype_white_1.svg",
  "Draw_white_15.svg",
  "Draw_white_19.svg",
  "MidPrototype_white_1.svg",
  "Draw_white_0.svg",
  "Draw_white_6.svg",
  "Draw_white_39.svg",
  "Draw_white_7.svg",
  "Draw_white_11.svg",
  "Draw_white_21.svg",
  "Draw_white_9.svg",
  "Draw_white_17.svg",
  "Draw_white_33.svg",
  "Draw_white_34.svg",
  "Draw_white_27.svg",
  "Draw_white_30.svg",
  "Draw_white_31.svg",
  "Draw_white_2.svg",
  "Draw_white_28.svg",
  "Draw_white_49.svg",
  "Draw_white_44.svg",
  "Draw_white_32.svg",
  "Draw_white_35.svg",
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

function remove(array, element){
  const index = array.indexOf(element);
  array.splice(index, 1);
}



