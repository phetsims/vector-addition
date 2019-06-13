// Copyright 2019, University of Colorado Boulder

/**
 * Common model is the shared model for every Screen respectively. Its main responsibility is to control the state
 * of the simulation.
 *
 * The model is not specific for an individual scene as it toggles global 'settings' of the simulation. For example,
 * turning on the 'angle visible' option on the control panel means the angle is visible for every scene.
 *
 * The model can also have an unknown amount of scenes (see Scene.js for documentation). 
 *
 * @author Martin Veillette
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const ComponentStyles = require( 'VECTOR_ADDITION/common/model/ComponentStyles' );
  const CoordinateSnapModes = require( 'VECTOR_ADDITION/common/model/CoordinateSnapModes' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const Scene = require( 'VECTOR_ADDITION/common/model/Scene' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );

  // constants
  const DEFAULT_COMPONENT_STYLE = VectorAdditionConstants.DEFAULT_COMPONENT_STYLE;
  const DEFAULT_COORDINATE_SNAP_MODE = VectorAdditionConstants.DEFAULT_COORDINATE_SNAP_MODE;

  class CommonModel {
    /**
     * @constructor
     * @param {Dimension2} graphDimension - the dimensions (width and height) of the graph
     * @param {Vector2} graphUpperLeftPosition - the model coordinates of the top left corner of the graph
     * @param {number} numberOfScenes - each model can have multiple scenes
     * @param {number} numberOfVectorSets - scenes can have multiple vectorSets
     * @param {Tandem} tandem
     */
    constructor( 
      graphDimension, 
      graphUpperLeftPosition, 
      numberOfScenes, 
      numberOfVectorSets, 
      tandem ) {

      // @public {BooleanProperty}
      this.sumVisibleProperty = new BooleanProperty( false );

      // @public {BooleanProperty}
      this.valuesVisibleProperty = new BooleanProperty( false );

      // @public {BooleanProperty}
      this.gridVisibleProperty = new BooleanProperty( true );

      // @public {EnumerationProperty<ComponentStyles>} - controls the visibility of the component styles
      this.componentStyleProperty = new EnumerationProperty( ComponentStyles, DEFAULT_COMPONENT_STYLE );

      // @public {EnumerationProperty<CoordinateSnapModes>} - controls the snapping mode for the vectors
      this.coordinateSnapModeProperty = new EnumerationProperty( CoordinateSnapModes, DEFAULT_COORDINATE_SNAP_MODE );

      // @public {BooleanProperty} - controls the visibility of the angle
      this.angleVisibleProperty = new BooleanProperty( false );


      // Method to create scenes, make this a separate method so sub-classes can override.
      // Currently, 1D model overrides this to give vector orientations for each scene.
      this.createScenes(       
        graphDimension, 
        graphUpperLeftPosition, 
        numberOfScenes, 
        numberOfVectorSets );

    }

    /**
     * @public
     * Reset the common model.
     */
    reset() {
      this.sumVisibleProperty.reset();
      this.valuesVisibleProperty.reset();
      this.gridVisibleProperty.reset();
      this.angleVisibleProperty.reset();
      
      // reset every scene in this.scenes
      for ( let i = 0; i < this.scenes.length; i++ ) {
        this.scenes[ i ].reset();
      }
    }

    /**
     * @private
     * Create the scenes
     * Make a separate method (can be overridden if the scenes need a specific orientation, see Graph.js)
     * @param {Dimension2} graphDimension - the dimensions (width and height) of the graph
     * @param {Vector2} graphUpperLeftPosition - the model coordinates of the top left corner of the graph
     * @param {number} numberOfScenes - each model can have multiple scenes
     * @param {number} numberOfVectorSets - scenes can have multiple vectorSets
     * @param {Tandem} tandem
     */
    createScenes( 
        graphDimension, 
        graphUpperLeftPosition, 
        numberOfScenes, 
        numberOfVectorSets ) {

      // @public {array.<Scene>} scenes - array of the scenes
      this.scenes = [];

      for ( let i = 0; i < numberOfScenes; i++ ) {
        this.scenes.push( new Scene( graphDimension, graphUpperLeftPosition, numberOfVectorSets ) );
      }
      
    }

    /**
     * @abstract
     * @public
     * Create the graph model(s) (1D has 2 graph scenes)
     */
    instantiateGraphs() {
      throw new Error( 'instantiateGraphs should be implemented in the descendant class' );
    }

    /**
     * @abstract
     * @public
     * Reset the graph model(s)
     */
    resetGraphs() {
      throw new Error( 'resetGraphs should be implemented in the descendant class' );
    }
  }

  return vectorAddition.register( 'CommonModel', CommonModel );
} );