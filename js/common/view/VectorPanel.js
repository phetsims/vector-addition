// Copyright 2019, University of Colorado Boulder

/**
 * Abstract View for the panel with vectors to drag into the screen. This class is abstract because many of the screens
 * have different types of vector panels functionality/appearance including:
 *  - orientation/appearance of the vector icon
 *  - names of the vector
 *  - number of vectors on the panel
 *  - orientation/appearance of the vector representation (node for the vector when dragging onto the screen)
 *  - infinite number of vectors can be dragged vs. finite
 *  - including a label next to the icon vs not including a label
 *
 * The screens in the simulation respectively must extend this class and provide the abstract methods.
 *
 * @author Martin Veillette
 */
define( require => {
  'use strict';

  // modules
  const DragListener = require( 'SCENERY/listeners/DragListener' );
  const LayoutBox = require( 'SCENERY/nodes/LayoutBox' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Panel = require( 'SUN/Panel' );
  const Vector = require( 'VECTOR_ADDITION/common/model/Vector' );
  const Vector2Property = require( 'DOT/Vector2Property' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

  // constants
  const SLOTS_SPACING = 20;

  // TODO: add a option to put the labels next to the icons
  class VectorPanel extends Node {
    /**
     * @abstract
     * @constructor
     * @param {ObservableArray} - the observable array to add the vector's to.
     * @param {number} numberOfVectorSlots - the number of slots to bring vectos onto the screen
     * @param {Property.<ModelViewTransform2>} - the property of the model - view coordinate transformation
     * @param {object} options - the optional arguments for the vector panel
     */
    constructor( vectorArray, numberOfVectorSlots, modelViewTransformProperty, options ) {

      options = _.extend( {
        labels: null, // {array.<string>} - array to give a label to the vectors pulled from each slot.
        // Example: labels: ['a', 'b'] would mean that every vector pulled from the first slot would have the 'a' label
        // and every vector pulled from the second slot would have the 'b' label. This length of the array much match
        // the number of vector slots. If labels is null than it doesn't give any vector a label.
        
        observableArrays: null, // {array.<ObservableArray>} - if provided, this will override the vectorArray (1st arugment)
        // This is used when there are multiple observable arrays needed. Example: observableArrays of 2 would mean that
        // every vector pulled from the first slot would be added to the first observableArray in observableArrays.
        // This must be the same length as numberOfVectorSlots if provided
        
        isVectorSlotInfinite: false, // {boolean} - if true, the vector slot will re-add a vector to the slot when removed.
        
        panelOptions: null // below are the defaults
      }, options );


      options.panelOptions = _.extend( {
        fill: 'white'
      }, options.panelOptions );

      super();

      // array for the vector icons to be added
      const vectorIcons = [];

      // container for the vector representations (node for the vector when dragging onto the screen)
      const vectorRepresentationContainer = new Node();

      // loop through each slot
      for ( let slotNumber = 0; slotNumber < numberOfVectorSlots; slotNumber++ ) {

        // create the icon node by calling the abstract method, see createVectorIcon for documentation
        const vectorIconNode = this.createVectorIcon( slotNumber );


        vectorIcons.push( vectorIconNode );
        
        // When the vector icon is clicked, add a vector reprentation as a decoy vector to drag onto the screen
        vectorIconNode.addInputListener( DragListener.createForwardingListener( ( event ) => {
          
          // create the decoy vector representation for when the user is dragging the vector onto the screen
          const vectorRepresentationArrow = this.createVectorRepresentationArrow();

          // create a location property to track the location of where the user dragged the vector representation
          const vectorRepresentationlocationProperty = new Vector2Property( this.globalToParentPoint( event.pointer.point ) );
          
          // create a drag listener for the vector representation node
          const vectorRepresentationDragListener = new DragListener({
            targetNode: vectorRepresentationArrow,
            translateNode: true,
            locationProperty: vectorRepresentationlocationProperty,
            // TODO: add a drag bounds?
            end: () => {
              // TODO: what should we do if the user dragged it off the grid

              // When the drag has finished, dispose the representation
              vectorRepresentationArrow.dispose();

              // get the drag location
              const vectorRepresentationPosition = modelViewTransformProperty.value.viewToModelPosition( 
                vectorRepresentationlocationProperty.value 
              );

              // get the default vector components to add to the screen, see getDefaultVectorComponents for documentation
              const defaultVectorComponents = this.getDefaultVectorComponents();

              // If there are multiple observable arrays, add a new vector to the slot number
              if ( options.observableArrays ) {

                options.observableArrays.get( slotNumber ).push(
                  new Vector( 
                    vectorRepresentationPosition,
                    defaultVectorComponents.x,
                    defaultVectorComponents.y,
                    modelViewTransformProperty, {
                      label: options.labels ? options.labels[ slotNumber ]: null
                    }
                  )
                );
                return;
              }
              vectorArray.push(
                new Vector( 
                  vectorRepresentationPosition,
                  defaultVectorComponents.x,
                  defaultVectorComponents.y,
                  modelViewTransformProperty, {
                    label: options.labels ? options.labels[ slotNumber ]: null
                  }
                )
              );
            } 
          });

          vectorRepresentationContainer.addChild( vectorRepresentationArrow );
          vectorRepresentationArrow.addInputListener( vectorRepresentationDragListener );

          if ( !options.isVectorSlotInfinite ) {
            vectorIconNode.visible = false;
          }

          vectorRepresentationArrow.center = this.globalToParentPoint( event.pointer.point );
          vectorRepresentationDragListener.press( event );
        } ) );
      }

      const slotsLayoutBox = new LayoutBox( {
        spacing: SLOTS_SPACING,
        children: vectorIcons
      } );

      const panel = new Panel( slotsLayoutBox, options.panelOptions );

      // TODO: hoist?
      panel.right = 950;
      panel.top = 300;

      this.setChildren([ panel, vectorRepresentationContainer ] );
    }
    /**
     * @abstract
     * Create an arrow node that is the vector icon
     * @param {number} slotNumber
     * @returns {ArrowNode}
     * @public
     */
    createVectorIcon( slotNumber ) {}
    /**
     * @abstract
     * Create an arrow node that is the arrow node when dragging onto the screen (vector representation arrow)
     * @returns {ArrowNode}
     * @public
     */
    createVectorRepresentationArrow() {}
    /**
     * @abstract
     * Get the default vector components for when the vector is released onto the graph (model coordinates)
     * @returns {Vector2}
     * @public
     */
    getDefaultVectorComponents() {}

  }

  return vectorAddition.register( 'VectorPanel', VectorPanel );
} );

