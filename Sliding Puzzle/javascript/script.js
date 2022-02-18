// Constants created from HTML TAGS;

const tag_main_screen = document.querySelector("#main_screen");
const tag_ranking_screen = document.querySelector("#ranking_screen");
const tag_credits_screen = document.querySelector("#credits_screen");
const tag_pause_screen = document.querySelector("#pause_screen");
const tag_victory_screen = document.querySelector("#victory_screen");

const tag_ranking_screen_table = document.querySelector("#ranking_screen_table");
const tag_victory_screen_table = document.querySelector("#victory_screen_table");

const tag_no_data_message = document.querySelector("#no_data_message");

const tag_game_container = document.querySelector("#game_container");

const tag_total_moves_txt = document.querySelector("#total_moves_txt");
const timer_value = document.querySelector("#timer_value");

const tag_btn_start_game = document.querySelector("#btn_start_game");
const tag_btn_open_ranking_screen = document.querySelector("#btn_open_ranking_screen");
const tag_btn_open_credits_screen = document.querySelector("#btn_open_credits_screen");

const tag_btn_pause_game = document.querySelector("#btn_pause_game");
const tag_btn_resume_game = document.querySelector("#btn_resume_game");

const tag_btn_reset_game = document.querySelector("#btn_reset_game");
const tag_btn_exit_game = document.querySelector("#btn_exit_game");

const tag_btn_save_game_result = document.querySelector("#btn_save_game_result");

const tag_btn_close_ranking_screen = document.querySelector("#btn_close_ranking_screen");
const tag_btn_close_credits_screen = document.querySelector("#btn_close_credits_screen");

const tag_original_image_box = document.querySelector("#original_image_box"); 
const tag_puzzle_image_box = document.querySelector("#puzzle_image_box"); 
const tag_pieces_box = document.querySelector("#pieces_box"); 

const tag_timer = document.querySelector("#timer"); 

const tag_table_row_template = document.querySelector("#table_row_template");


// =============================================================================================

Game();

// =============================================================================================

function Game()
{
         
    // ----------------------------------------------------------------

    var victory;
    var total_moves;
    var timer = new Timer();

    var local_storage_data = new Local_storage_data(1,"ranking_data");
    var ranking_data = local_storage_data.load();

    var matriz_board = [[],[],[],[]];
    var last_player_id = -1; 
           
    engine_set_main_events(); 
   
    // ----------------------------------------------------------------

    function engine_set_main_events()
    {
        
        tag_btn_open_ranking_screen.addEventListener("click",engine_open_ranking_screen);
        tag_btn_close_ranking_screen.addEventListener("click",engine_close_ranking_screen); 

        tag_btn_open_credits_screen.addEventListener("click",engine_open_credits_screen);
        tag_btn_close_credits_screen.addEventListener("click",engine_close_credits_screen);
        
        tag_btn_start_game.addEventListener("click",engine_start_game);
        tag_btn_pause_game.addEventListener("click",engine_pause_game);
        tag_btn_reset_game.addEventListener("click",engine_reset_game);
        tag_btn_resume_game.addEventListener("click",engine_resume_game);
        tag_btn_exit_game.addEventListener("click",engine_exit_game);
       
    }  

    // ----------------------------------------------------------------
    
    function engine_start_game()
    {
       change_current_screen((victory) ? null : tag_main_screen.parentElement,null);
       
        victory = false;
        
        total_moves = 0;
    
        timer.start_time = new Date();

        Set_element_disabled(tag_btn_pause_game,false);


        Set_element_txt(timer_value,`00:00:00`);
        Set_element_txt(tag_total_moves_txt,total_moves);
        
        timer.set_timer_counter(engine_update_timer);
          
        engine_load_pieces();
    
        Set_element_attribute(tag_puzzle_image_box,"open",true);
    }

    // ----------------------------------------------------------------

    function engine_load_ranking()
    {
        const tag_table_body = tag_ranking_screen_table.querySelector("tbody");
        
        Remove_element_children(tag_table_body);
        
       

        ranking_data = local_storage_data.load();
      
           
            for(const row_data of ranking_data)
            {
                const tag_table_row_copy = document.importNode(tag_table_row_template.content,true);
                const tag_table_row = tag_table_row_copy.querySelector("tr");

                const tag_player_pos_cell = tag_table_row.querySelector(".player_pos_cell");
                const tag_player_name_cell = tag_table_row.querySelector(".player_name_cell");
                const tag_game_time_cell = tag_table_row.querySelector(".game_time_cell");
                const tag_game_total_moves_cell = tag_table_row.querySelector(".game_total_moves_cell");
                const tag_date_cell = tag_table_row.querySelector(".date_cell");
                                
                
                var [id,position,name,time,moves,date] = row_data; 
                
                var [hours,minutes,seconds] = timer.format_milliseconds(time);

                date = new Date(date);

                var [year,month,day] = [date.getFullYear(),date.getMonth(),date.getDate()];

                month++;

                [year,month,day] = timer.add_zero([year,month,day]);

                Remove_class(tag_player_pos_cell,"display_none");
                          
                                    
                Set_element_txt(tag_player_pos_cell,`${position}º`);
                Set_element_txt(tag_player_name_cell,name);
                Set_element_txt(tag_game_time_cell,`${hours}:${minutes}:${seconds}`);
                Set_element_txt(tag_game_total_moves_cell,moves);
                Set_element_txt(tag_date_cell,`${year}/${month}/${day}`);

                Add_element_child(tag_table_body,tag_table_row_copy);

                if(id == last_player_id)
                {
                    last_player_id = -1;  
                    
                    Add_class(tag_table_row,"golden_row");
                }  
               
            }                                                                      
                const tag_golden_row = tag_table_body.querySelector(".golden_row");

                if(tag_golden_row)
                    tag_golden_row.scrollIntoView();
                                   
      }
    
    // ================================================================

    function engine_open_ranking_screen()
    {
       
        engine_load_ranking();

        change_current_screen((victory) ? tag_victory_screen.parentElement : tag_main_screen.parentElement,tag_ranking_screen.parentElement);
        
        Add_class((ranking_data.length) ? tag_no_data_message : tag_ranking_screen_table.parentElement,"display_none"); 
    
    }

    // ================================================================

    function engine_close_ranking_screen()
    {
        change_current_screen(tag_ranking_screen.parentElement,(victory) ? null : tag_main_screen.parentElement);

        if(victory)
        {
            Set_element_attribute(tag_original_image_box,"open");   
            Set_element_attribute(tag_puzzle_image_box,"open");    
        }
        
        Remove_class((ranking_data.length) ? tag_no_data_message : tag_ranking_screen_table.parentElement,"display_none"); 
    }

    // ================================================================

    function engine_open_credits_screen()
    {
        change_current_screen(tag_main_screen.parentElement,tag_credits_screen.parentElement);
    }

    // ================================================================

    function engine_close_credits_screen()
    {
        change_current_screen(tag_credits_screen.parentElement,tag_main_screen.parentElement);
    }

    // ================================================================

    function engine_open_victory_screen()
    {
        change_current_screen(null,tag_victory_screen.parentElement);
    }

    // ================================================================

    function engine_pause_game(ev)
    {
        new Audio("media/pause.wav").play();

        change_current_screen(null,tag_pause_screen.parentElement);
            
        Set_element_disabled(ev.target,true);
        Set_element_disabled(tag_btn_resume_game,false);

        timer.pause_timer(); 
    }

    // ================================================================

    async function engine_reset_game()
    {
     
        timer.pause_timer(); 
            
        if(victory || await Message.confirm_box("Are you sure that you want to start a new game?")) 
        {
            
            Remove_element_children(tag_pieces_box);
            
            Remove_element_attribute(tag_original_image_box,"open");

            engine_start_game();
         
        }
        else
            timer.resume_timer(engine_update_timer);

    }

    // ================================================================

    function engine_resume_game(ev)
    {
        new Audio("media/resume.wav").play();
        
        change_current_screen(tag_pause_screen.parentElement,null);
            
        Set_element_disabled(ev.target,true);
        Set_element_disabled(tag_btn_pause_game,false);

        timer.resume_timer(engine_update_timer);

    }

    // ================================================================

    async function engine_exit_game()
    {
        timer.pause_timer(); 
            
        if(victory || await Message.confirm_box("Are you sure that you want to exit?")) 
        {
            victory = false;
          
             Remove_element_attribute(tag_original_image_box,"open");
             Remove_element_attribute(tag_puzzle_image_box,"open");
             
             change_current_screen(null,tag_main_screen.parentElement);
             
             Remove_element_children(tag_pieces_box);
            
             Set_element_txt(timer_value,`00:00:00`);      
             
             Set_element_txt(tag_total_moves_txt,"0");       
        }
        else
            timer.resume_timer(engine_update_timer);
        

    }

    // ================================================================

    function change_current_screen(screen_out,screen_in)
    {
        if(screen_out)
            Add_class(screen_out,"visibility_hidden");
            
        if(screen_in)
            Remove_class(screen_in,"visibility_hidden");
    }

    // =================================================================

    function engine_update_timer()
    {
      
        timer.update_passed_time();
        
        var[hours,minutes,seconds] = timer.format_milliseconds(timer.passed_time);          

        Set_element_txt(timer_value,`${hours}:${minutes}:${seconds}`);
  
    }

   // ================================================================
    
    function engine_load_pieces()
    {
        var array_pieces = build_array_pieces();
    
        matriz_board = build_matriz_board();
    
        render_pieces();
    
        set_active_pieces();
        
    // ---------------------------------------------------------------

    function build_array_pieces()
    {
        var matriz_pieces = [[],[],[],[]];

        var  piece_class_name = 1;

        for(var y = 0; y < 4; y++)
        {
          
            for(var x = 0; x < 8; x++)
            {
              
                matriz_pieces[y][x] = {
                                        pos_y: y,
                                        pos_x: x,
                                        animation_class: "", 
                                        html_tag: create_piece_html_tag(piece_class_name++) 
                                       }
       
            }

        }
            
        
        return matriz_pieces.flatMap(piece => piece);
    }

    // ---------------------------------------------------------------

    function create_piece_html_tag(piece_class_name)
    {        
         const tag_piece = Create_element("div");
      
         Add_class(tag_piece,`piece_${piece_class_name}`);
 
         if(piece_class_name == 8)
             Add_class(tag_piece,"empty");
         
         return tag_piece;
     }
    
    // ---------------------------------------------------------------

    function build_matriz_board()
    {               
            var matriz_board = [[],[],[],[]];

            for(var y = 0; y < 4; y++)
            {
                for(var x = 0; x < 8; x++)
                {
                    matriz_board[y][x] = pick_random_piece();
                }
    
            }
  
            return matriz_board;
     }

      // ---------------------------------------------------------------

      function pick_random_piece()  
      {
          var index = Generate_random_number(0,(array_pieces.length - 1));
          
          var piece = array_pieces[index];
  
          array_pieces.splice(index,1);
  
          return piece; 
      }
    

    }

    // ================================================================

    function render_pieces()
    {

        matriz_board.forEach(line => {
            
            line.forEach(piece => {

                Add_element_child(tag_pieces_box,piece.html_tag); 

            });
            
        });
    }

    // ================================================================
  
    function set_active_pieces()
    {
      var [empty_space_pos_y,empty_space_pos_x] = pick_index_by_class("empty"); 
                             
      var active_pieces_possible_moves = [
                                                {
                                                    logic_test: (empty_space_pos_y),
                                                    pos_y: empty_space_pos_y - 1,
                                                    pos_x: empty_space_pos_x,
                                                    animation_class: "move_to_bottom_animation"
                                                },
                                                {
                                                    logic_test: (empty_space_pos_y + 1 < matriz_board.length),
                                                    pos_y: empty_space_pos_y + 1,
                                                    pos_x: empty_space_pos_x,
                                                    animation_class: "move_to_top_animation"
                                                },
                                                {
                                                    logic_test: (empty_space_pos_x < matriz_board[empty_space_pos_y].length - 1),
                                                    pos_y: empty_space_pos_y,
                                                    pos_x: empty_space_pos_x + 1,
                                                    animation_class: "move_to_right_animation"
                                                },
                                                {
                                                    logic_test: (empty_space_pos_x),
                                                    pos_y: empty_space_pos_y,
                                                    pos_x: empty_space_pos_x - 1,
                                                    animation_class: "move_to_left_animation"
                                                }

                                            ];

        
        for(var active_piece_possible_move of active_pieces_possible_moves)
        {
            if(active_piece_possible_move.logic_test)
            {   

                matriz_board[active_piece_possible_move.pos_y]
                            [active_piece_possible_move.pos_x].animation_class = active_piece_possible_move.animation_class;

                Add_class(matriz_board[active_piece_possible_move.pos_y][active_piece_possible_move.pos_x].html_tag,"active");        
                
                matriz_board[active_piece_possible_move.pos_y]
                            [active_piece_possible_move.pos_x].html_tag.addEventListener("click",move_pieces);
                                               
            }

        }                                     
                      
    }

    // ------------------------------------------------------------------------------------------------------------------------------

    function pick_index_by_class(cls)
    {
       return matriz_board.reduce((array,line,pos_y) => {
                                                            var pos_x = line.findIndex(piece => piece.html_tag.classList.contains(cls));

                                                                                    if(pos_x != -1)
                                                                                        array = [pos_y,pos_x];

                                                                                    return array;    
                                                        
                                                        },[]);  
    }

    // -----------------------------------------------------------------------------------------------------------------------------

    function move_pieces(ev)
    {

        Set_element_txt(tag_total_moves_txt,++total_moves);

        const tag_piece = ev.target;

        Add_class(tag_piece,"current_move_piece");  
       
        var [active_piece_pos_y,active_piece_pos_x] = pick_index_by_class("current_move_piece");

        var active_piece = matriz_board[active_piece_pos_y][active_piece_pos_x];
    
        var animation_class = active_piece.animation_class;
        
        Add_class(active_piece.html_tag,animation_class);

        engine_reset_active_pieces();
        
        // -----------------------------------------------------------------------------------------------------------------------------
               
        var [empty_space_piece_pos_y,empty_space_piece_pos_x] = pick_index_by_class("empty");

        var empty_space_piece = matriz_board[empty_space_piece_pos_y][empty_space_piece_pos_x];
    
        // -----------------------------------------------------------------------------------------------------------------------------
        
      

        window.setTimeout(() => { 

            Remove_element_children(tag_pieces_box);

            Remove_class(active_piece.html_tag,"current_move_piece");  
            Remove_class(active_piece.html_tag,animation_class);
             

            matriz_board[empty_space_piece_pos_y]
                        [empty_space_piece_pos_x] = active_piece; 
    
            matriz_board[active_piece_pos_y]
                        [active_piece_pos_x] = empty_space_piece;          
  
    
            render_pieces();

            engine_check_victory();
                                        
             
        },300);
     
           
    }

    // -----------------------------------------------------------------------------------------------------------------------------

    /*

    function engine_win_game()
    {

        var piece_class_number = 1; 

       matriz_board = matriz_board.map((line) => {
            
            return line.map((piece) => {
                        
                                            
                                            var [y,x] = pick_index_by_class(`piece_${piece_class_number++}`);

                                            return matriz_board[y][x]; 

                                        });

           }); 
           
           engine_reset_active_pieces();

           Remove_element_children(tag_pieces_box);
            
           render_pieces();

           engine_check_victory();

    }
    
    
    */
  

    // -----------------------------------------------------------------------------------------------------------------------------
   
    function engine_check_victory()
    {

        victory = check_victory();

        if(victory)
        {
          timer.pause_timer();
          engine_finish_game();
        }
        else
            set_active_pieces();
        

    }

    // -----------------------------------------------------------------------------------------------------------------------------

    async function engine_finish_game()
    {

        new Audio("media/win.mp3").play();

        Remove_element_attribute(tag_puzzle_image_box,"open"); 
        Remove_element_attribute(tag_original_image_box,"open"); 

              
        const tag_table_body = tag_victory_screen_table.querySelector("tbody");

        var[hours,minutes,seconds] = timer.format_milliseconds(timer.passed_time);
        
        var total_seconds = ((hours * 3600)  + (minutes * 60) + (seconds));

        var [year,month,day] = [timer.current_time.getFullYear(),timer.current_time.getMonth(),timer.current_time.getDate()];

        month++;
        
        [year,month,day] = timer.add_zero([year,month,day]);

        const tag_table_row_copy = document.importNode(tag_table_row_template.content,true);
        const tag_table_row = tag_table_row_copy.querySelector("tr");
        
        const tag_player_name_cell = tag_table_row.querySelector(".player_name_cell");
        const tag_game_time_cell = tag_table_row.querySelector(".game_time_cell");
        const tag_game_total_moves_cell = tag_table_row.querySelector(".game_total_moves_cell");
        const tag_date_cell = tag_table_row.querySelector(".date_cell");

        const tag_input_text = Create_element("input");

        Set_element_attribute(tag_input_text,"type","text");
        Set_element_attribute(tag_input_text,"maxlength","20");
        Set_element_attribute(tag_input_text,"placeholder","put your name here");

        Add_element_child(tag_player_name_cell,tag_input_text);

        Set_element_txt(tag_game_time_cell,`${hours}:${minutes}:${seconds}`);
        Set_element_txt(tag_game_total_moves_cell,total_moves);
        Set_element_txt(tag_date_cell,`${year}/${month}/${day}`);

        Add_element_child(tag_table_body,tag_table_row_copy);
       
        engine_open_victory_screen();

        tag_input_text.focus();

        Set_element_disabled(tag_btn_pause_game,true);
       
        Set_element_disabled(tag_btn_save_game_result,false);

        tag_btn_save_game_result.addEventListener("click",Engine_save_player_data);
        
        
        function Engine_save_player_data()
        {
          
        var player_data = [];

        const pick_unique_id =  () => { 
                                            var ids = ranking_data.map(data => data[0]);
                                            var new_id;        
            
                                            do
                                            {
                                            new_id = Generate_random_number(1,(ids.length + 10000));                     
                                            }
                                            while(ids.indexOf(new_id) != -1);

                                            return new_id;

                                       };

        
        player_data[0] = pick_unique_id();

        player_data[1] = -1;
        player_data[2] = (Get_element_value(tag_input_text).trim().length) ? Get_element_value(tag_input_text).trim() : 
                                                                                    "Unknow Player";
        player_data[3] = (total_seconds * 1000);
        player_data[4] = total_moves;
        player_data[5] =  `${year}/${month}/${day}`;

        last_player_id = player_data[0];
          
        ranking_data.push(player_data);
           
        ranking_data = sort_ranking_data();
     
        local_storage_data.save(ranking_data);
           
        engine_open_ranking_screen();
        
        Remove_element(tag_table_row);
        
        tag_btn_save_game_result.removeEventListener("click",Engine_save_player_data);

        } 
                                                 
    }
    
    // =========================================================================================

    function sort_ranking_data()
    {

        const pick_data = (array_data,data,index) => 
        {                        
            (array_data.indexOf(data[index]) == -1) ? array_data.push(data[index]) : null; 
            
            return array_data; 
        }
        
        // -------------------------------------------------------------------------------

        const pick_times = (array_data,data) =>
        {
            return pick_data(array_data,data,3); 
        } 

        // -------------------------------------------------------------------------------

        const pick_moves = (array_data,data) =>
        {
            return pick_data(array_data,data,4); 
        } 

        // -------------------------------------------------------------------------------

        const sort_data = (dt_1, dt_2) => dt_1 - dt_2;

        // --------------------------------------------------------------------------------

        const sort_data_by_time = (player_1,player_2) =>
        {
            return sort_data(player_1[3],player_2[3]);
        }

        // --------------------------------------------------------------------------------

        const sort_data_by_moves = (player_1,player_2) =>
        {
            return sort_data(player_1[4],player_2[4]);
        }

        // --------------------------------------------------------------------------------
                
        const filter_data_by_param = (array_data,param,index) =>
        {
            var data = ranking_data.filter(data => data[index] == param);

            if(data.length)
            {   
                array_data.push(data);
            }

            return array_data;
        }

       // --------------------------------------------------------------------------------
   
        const filter_data_by_time = (array_data,param) =>
        {
            return filter_data_by_param(array_data,param,3);
        } 
    
        // --------------------------------------------------------------------------------
  
        function enumerate_data(data,index,array)
        {
         
          if(index)
          {
              data[1] = (
                                     (array[index - 1][3] == data[3]) && 
                                     (array[index - 1][4] == data[4])
                        )  ?   
                            current_pos 
                           : 
                            current_pos += array.filter(dt =>   (
                                                                    (array[index - 1][3] == dt[3]) && 
                                                                    (array[index - 1][4] == dt[4])
                                                                )
                                                       ).length;
                                                                                                    
          }     
          else  
          {     
                data[1] = current_pos;
          }
         
          return data;
            
        }
          
        // --------------------------------------------------------------------------------
        
        var current_pos = 1;

 

       
                        return ranking_data.reduce(pick_times,[]) // pick all times 
                                           .sort(sort_data)       // sort all times
                                           .reduce(filter_data_by_time,[]) // group data by times
                                           .map((data) => data.sort(sort_data_by_moves)) // sort data by moves
                                           .flatMap(data => data) // turn the matriz in array
                                           .map(enumerate_data); // set positions
                                                                    
        
                               
                                              
      
    }

     // =========================================================================================

    function engine_reset_active_pieces()
    {

        matriz_board = matriz_board.map((line) => {
                                                    return line.map((piece) => {

                                                                if(piece.html_tag.classList.contains("active"))
                                                                {
                                                                   piece.html_tag.removeEventListener("click",move_pieces);
                                                                   
                                                                   Remove_class(piece.html_tag,"active");
                                                                   
                                                                   piece.animation_class = "";
                                                                 
                                                                }

                                                                return piece;

                                                                 });

                                                   });  
 
    }

    // -----------------------------------------------------------------------------------------------------------------------------
  
    function check_victory()
    {              
        return matriz_board.every((line,pos_y) => line.every((piece,pos_x) => ((piece.pos_y == pos_y) && (piece.pos_x == pos_x)))); 
    }

    // -----------------------------------------------------------------------------------------------------------------------------

}

// =====================================================================================================================================



// Default Functions;

// ======================================================================================================================================

function Set_element_value(element,val)
{
    element.value = val;
}
    
// =========================================================================================

function Get_element_value(element)
{
    return element.value;
}

// =========================================================================================


function Add_class(element,cls)
{   
    element.classList.add(cls);
}

// ========================================================================================

function Remove_class(element,cls)
{

    element.classList.remove(cls);
    
}

// ==========================================================================================

function Add_attribute(element,attribute)
{
    element.setAttributeNode(attribute);
}

// ==========================================================================================

function Set_element_attribute(element,attr,val)
{
    element.setAttribute(attr,val);
            
}
    
// ===========================================================================================

function Create_attribute(attribute)
{
    return document.createAttribute(attribute);
}

// ===========================================================================================

function Get_element_attribute(element,attr)
{
   return element.getAttribute(attr);
        
}

// ===========================================================================================

function Remove_element_attribute(element,attr)
{
    element.removeAttribute(attr);
}
    
// ============================================================================================

function Set_element_txt(element,txt)
{
    element.textContent = txt;
}

// ============================================================================================

function Get_element_txt(element)
{
    return element.textContent;
}

// ============================================================================================

function Set_element_disabled(element,disabled = false)
{
    element.disabled = disabled;
}
        
// ============================================================================================

function Generate_random_number(num_1,num_2)
{
    var random_number = num_1 + (Math.round(Math.random() * (num_2 - num_1)));
    
    return random_number;
    
}

// ===========================================================================================

function Create_element(element)
{
    return document.createElement(element);
}   

// ===========================================================================================

function Add_element_child(element,child)
{
    element.appendChild(child);
}

// ===========================================================================================

function Set_element_dataset(element,dataset_name,value)
{
    element.dataset[dataset_name] = value;
}

// =========================================================================================

function Get_element_dataset(element,dataset_name)
{
    return element.dataset[dataset_name];
}

// ========================================================================================

function Call_function_helper(func,elements,param = null)
{
    for(const element of elements)
    {    
        if(param)
            func(element,param);
        else
            func(element);  
    } 
}

// ===========================================================================================

function Remove_element(element)
{
    element.remove(); 
}

// ============================================================================================

function Remove_element_children(element)
{
    while(element.childElementCount)
        Remove_element(element.lastChild);
}

// ============================================================================================
