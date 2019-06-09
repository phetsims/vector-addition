// Copyright 2019, University of Colorado Boulder

/**
 * @author Martin Veillette
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const ComponentStyles = require( 'VECTOR_ADDITION/common/model/ComponentStyles' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const ObservableArray = require( 'AXON/ObservableArray' );
  const Property = require( 'AXON/Property' );
  const Vector2 = require( 'DOT/Vector2' );
  const Vector2Property = require( 'DOT/Vector2Property' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorOrientation = require( 'VECTOR_ADDITION/common/model/VectorOrientation' );
  const VectorSum = require( 'VECTOR_ADDITION/common/model/VectorSum' );

  // constants
  const UPPER_LEFT_LOCATION = new Vector2( 29, 90 );
  const MODEL_VIEW_SCALE = 12.5;

  /**
   * @constructor
   */
  class CommonModel {

    /**
     * @param {Dimension2} gridDimension - the dimensions for the graph
     * @param {Vector2} upperLeftCoordinate - the location of the upperLeft corner of the graph
     * @param {Tandem} tandem
     */
    constructor( gridDimension, upperLeftCoordinate, tandem ) {

      // @public {BooleanProperty}
      this.sumVisibleProperty = new BooleanProperty( false );

      // @public {BooleanProperty}
      this.valuesVisibleProperty = new BooleanProperty( false );

      // @public {BooleanProperty}
      this.gridVisibleProperty = new BooleanProperty( true );

      // @public {Property.<VectorOrientation>}
      this.vectorOrientationProperty = new Property( VectorOrientation.HORIZONTAL );

      // @public {EnumerationProperty<ComponentStyles>} - controls the visibility of the component styles
      this.componentStyleProperty = new EnumerationProperty( ComponentStyles, ComponentStyles.INVISIBLE );

      // @public {BooleanProperty} - controls the visibility of the angle
      this.angleVisibleProperty = new BooleanProperty( false );

      // @public {VectorProperty} - the location the top left corner of the grid
      this.upperLeftPositionProperty = new Vector2Property( upperLeftCoordinate );

      this.gridModelBounds;

      this.upperLeftPositionProperty.link( ( upperLeftCoordinate ) => {

        // @public {Bounds2} - the model bounds for the grid
        this.gridModelBounds = new Bounds2(
          upperLeftCoordinate.x,
          upperLeftCoordinate.y - gridDimension.height,
          upperLeftCoordinate.x + gridDimension.width,
          upperLeftCoordinate.y );

      } );

      // @public {Property.<ModelViewTransform2>} - the model-view transform of the simulation
      this.modelViewTransformProperty = new DerivedProperty( [ this.upperLeftPositionProperty ], ( upperLeftCoordinate ) =>
        ModelViewTransform2.createSinglePointScaleInvertedYMapping(
          upperLeftCoordinate, UPPER_LEFT_LOCATION, MODEL_VIEW_SCALE )
      );

      // @public {ObservableArray.<Vector>}
      this.vectors = new ObservableArray();

      this.vectorSum = new VectorSum( this.vectors, this.modelViewTransformProperty );
    }

    // @public resets the model
    reset() {
      this.sumVisibleProperty.reset();
      this.valuesVisibleProperty.reset();
      this.gridVisibleProperty.reset();
      this.angleVisibleProperty.reset();
      this.upperLeftPositionProperty.reset();
      this.vectors.reset();
    }
  }

  return vectorAddition.register( 'CommonModel', CommonModel );
} );