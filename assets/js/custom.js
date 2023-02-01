$(document).ready(function(){

  $(".userMenu").click(function(){

    $(this).siblings('ul').toggleClass('invisible');
    
  });

  $("svg.close-badge").click(function(){

    $(this).parent().parent().parent().hide();

  });

  $("button").click(function(e){
    let ele = $(this);
    if( $(this).attr("data-modal-toggle") )
    {
      e.preventDefault();
      let eletoToggle = $(this).attr("data-modal-toggle");
      $("#"+eletoToggle).toggleClass("hidden");
    }
    else if( $(this).attr("data-modal-hide") )
    {
      e.preventDefault();
      let eletoToggle = $(this).attr("data-modal-hide");
      $("#"+eletoToggle).addClass("hidden"); 
    }
  });

  $("#addLesson").submit(function(e){

    e.preventDefault();

    let action = $(this).attr("action");
    $.ajax({
      async:true,
      method:'post',
      url: action, 
      dataType:'JSON',
      data:$(this).serialize(),
      success: function(data, status)
      {
        if( data.error !== 1 )
        {
          $(".defaultModal").hide();
          window.location.reload();
        }
        else
        {
          alert(data.message);
        }
      },
      error: function(err)
      {
        console.log(err);
      }
    });
  });

  $("#assignCourse").submit(function(e){
    e.preventDefault();
    let action = $(this).attr("action");
    $.ajax({
      async:true,
      method:'post',
      url: action, 
      dataType:'JSON',
      data:$(this).serialize(),
      success: function(data, status)
      {
        if( data.error !== 1 )
        {
          $(".defaultModal").hide();
          window.location.reload();
        }
        else
        {
          alert(data.message);
        }
      },
      error: function(err)
      {
        console.log(err);
      }
    });
  });

  if( $(".talert-success").length )
  {
    $(".talert-success").removeClass('hidden').addClass('slide-in').delay(3000).queue(function () {
        $(this).removeClass('slide-in').addClass('hidden');
    });
  }

  if( $(".talert-error").length )
  {
    $(".talert-error").removeClass('hidden').addClass('slide-in').delay(3000).queue(function () {
        $(this).removeClass('slide-in').addClass('hidden');
    });
  }
  
  if( $(".coursesCompletedStudent").length )
  {
    let student_id = $(".coursesCompletedStudent").data('id');
    let ele = $(".coursesCompletedStudent");
    let action = '/students/completed/'+student_id;
    $.ajax({
      async:true,
      method:'get',
      url: action, 
      dataType:'JSON',
      success: function(data, status)
      {
        if( data.error !== 1 )
        {
          ele.html(data.count);
        }
        else
        {
          ele.html(data.message);
        }
      },
      error: function(err)
      {
        console.log(err);
        ele.html('Error');
      }
    });
  }

  if( $(".coursesAssignedtoStudent").length )
  {
    let student_id = $(".coursesAssignedtoStudent").data('id');
    let ele = $(".coursesAssignedtoStudent");
    let action = '/students/assigned/'+student_id;
    $.ajax({
      async:true,
      method:'get',
      url: action, 
      dataType:'JSON',
      success: function(data, status)
      {
        if( data.error !== 1 )
        {
          ele.html(data.count);
        }
        else
        {
          ele.html(data.message);
        }
      },
      error: function(err)
      {
        console.log(err);
        ele.html('Error');
      }
    });
  }

  if( $(".coursesAcceptedStudent").length )
  {
    let student_id = $(".coursesAcceptedStudent").data('id');
    let ele = $(".coursesAcceptedStudent");
    let action = '/students/accepted/'+student_id;
    $.ajax({
      async:true,
      method:'get',
      url: action, 
      dataType:'JSON',
      success: function(data, status)
      {
        if( data.error !== 1 )
        {
          ele.html(data.count);
        }
        else
        {
          ele.html(data.message);
        }
      },
      error: function(err)
      {
        console.log(err);
        ele.html('Error');
      }
    });
  }  

  if( $(".inline-action").length )
  {
    let ele = $(".inline-action").eq(0);
    let course = ele.data('course');
    let student = ele.data('student');
    let action = ele.data('action');
    let href = ele.attr('href');

    $(".inline-action").click(function(e)
    {
      e.preventDefault();
      let ele = $(this);
      let course = ele.data('course');
      let student = ele.data('student');
      let action = ele.data('action');
      let href = ele.attr('href');

      $.ajax({
        async:true,
        method:'post',
        url: href, 
        dataType:'JSON',
        data:{course:course, student:student, status:action},
        success: function(data, status) {
          if( data.error !== 1 )
          {
            ele.text(data.message);
            ele.removeClass('inline-action');
            ele.addClass('bg-green-600');
          }
          else
          {
            alert('Error Occured: '+ data.message);
          }
        },
        error: function(err)
        {
          console.log(err);
          ele.html('Error');
        }
      });
    });
  }

  if( $(".inline-action-update").length )
  {
    let ele = $(".inline-action-update").eq(0);
    let course = ele.data('course');
    let student = ele.data('student');
    let action = ele.data('action');
    let href = ele.attr('href');
    if( action == "" ){
      $.ajax({
        async:true,
        method:'post',
        url: href, 
        dataType:'JSON',
        data:{course:course, student:student, status:action},
        success: function(data, status) {
          if( data.error !== 1 )
          {
            ele.text(data.message);
            if( data.message == 'Assigned' ){
              ele.data('action', 'Accepted');
            }
          }
          else
          {
            ele.text(data.message);
          }
        },
        error: function(err)
        {
          console.log(err);
          ele.html('Error');
        }
      });
    }

    $(".inline-action-update").click(function(e)
    {
      e.preventDefault();
      let ele = $(this);
      let course = ele.data('course');
      let lesson = ele.data('lesson');
      let student = ele.data('student');
      let action = ele.data('action');
      let href = ele.attr('href');

      $.ajax({
        async:true,
        method:'post',
        url: href, 
        dataType:'JSON',
        data:{course:course, lesson:lesson,student:student, status:action},
        success: function(data, status) {
          if( data.error !== 1 )
          {
            ele.text(data.message);
            if( data.message == 'Assigned' ){
              ele.data('action', 'Accepted');
            } else {
              ele.data('action', 'Accepted');
              ele.addClass('bg-green-600');
            }
          }
          else
          {
            ele.text(data.message);
          }
        },
        error: function(err)
        {
          console.log(err);
          ele.html('Error');
        }
      });
    });
  }

  $("#filterCourses").change(function(e){

    let status = $(this).val();
    console.log(status);
    let item = 0;
    let itemFound = 0;
    $("table thead tr th").each(function(){
      if( $(this).text() == "STATUS")
      {
        itemFound = item;
      }
      item++;
    });    

    $("table tbody tr").each(function(){
      let searchTd = $(this).find('td').eq(itemFound).html();
      if( status != 'All' && searchTd.search(status) == -1 )
      {
        $(this).addClass('hidden');
      }
      else
      {
        $(this).removeClass('hidden'); 
      }

    });


  });


});