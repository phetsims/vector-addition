// Copyright 2019, University of Colorado Boulder

/**
 * Factory methods for creating the various icons that appear in the sim.
 *
 * @author Brandon Li
 */
define( function( require ) {
  'use strict';

  // modules
  const ArcArrowNode = require( 'VECTOR_ADDITION/common/view/ArcArrowNode' );
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const ComponentStyles = require( 'VECTOR_ADDITION/common/model/ComponentStyles' );
  const FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  const Line = require( 'SCENERY/nodes/Line' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const Shape = require( 'KITE/Shape' );
  const Util = require( 'DOT/Util' );
  const Vector2 = require( 'DOT/Vector2' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionColors = require( 'VECTOR_ADDITION/common/VectorAdditionColors' );
  const VectorTypes = require( 'VECTOR_ADDITION/common/model/VectorTypes' );

  //----------------------------------------------------------------------------------------
  // constants

  // Size of ALL icons created in this factory that are for radio buttons
  const RADIO_BUTTON_ICON_SIZE = 25;

  // Defaults for all arrow instances
  const ARROW_ICON_OPTIONS = {
    fill: VectorAdditionColors.VECTOR_GROUP_1_COLORS.fill,
    stroke: VectorAdditionColors.VECTOR_ICON_STROKE_COLOR,
    lineWidth: 0.5,
    headHeight: 5,
    headWidth: 9,
    tailWidth: 4,
    opacity: 1
  };

  // Semi opaque arrow for the components on the component radio button icons
  const OPAQUE_ARROW_OPTIONS = _.extend( {}, ARROW_ICON_OPTIONS, {
    opacity: 0.4
  } );

  // Radius for all arc arrow instances
  const ARC_ARROW_RADIUS = 14;


  class VectorAdditionIconFactory {
    /**
     * Create the Vector Icon that appears on the vector creator panel
     * @param {Vector2} initialVector - in model coordinates
     * @param {VectorTypes} vectorType
     * @param {Object} [options]
     * @public
     */
    static createVectorCreatorPanelIcon( initialVector, vectorType, options ) {

      assert && assert( initialVector instanceof Vector2, `invalid initialVector: ${initialVector}` );
      assert && assert( vectorType && VectorTypes.includes( vectorType ),
        `invalid vectorType: ${vectorType}` );

      //----------------------------------------------------------------------------------------

      options = _.extend( {
        lineWidth: 0,
        tailWidth: 4,
        headWidth: 10.5,
        headHeight: 6,
        cursor: 'pointer',
        arrowSize: 30,
        fill: vectorType === VectorTypes.ONE ? VectorAdditionColors.VECTOR_GROUP_1_COLORS.fill :
              VectorAdditionColors.VECTOR_GROUP_2_COLORS.fill
      }, options );


      const iconVector = initialVector.normalized().timesScalar( options.arrowSize );

      return new ArrowNode( 0, 0, iconVector.x, iconVector.y, options );
    }

    /*---------------------------------------------------------------------------*
     * The Following are Icons that appear next to check boxes
     *---------------------------------------------------------------------------*/
    /**
     * Creates the icon that appears next to the 'Sum' visibility checkbox
     * @param {VectorTypes} vectorType
     * @param {Object} [options]
     * @returns {Node}
     * @public
     */
    static createSumIcon( vectorType, options ) {

      assert && assert( vectorType && VectorTypes.includes( vectorType ),
        `invalid vectorType: ${vectorType}` );

      //----------------------------------------------------------------------------------------

      options = _.extend( {}, ARROW_ICON_OPTIONS, {
        lineWidth: 1,
        headHeight: 10,
        arrowSize: 24,
        fill: vectorType === VectorTypes.ONE ? VectorAdditionColors.VECTOR_GROUP_1_COLORS.sum :
              VectorAdditionColors.VECTOR_GROUP_2_COLORS.sum
      }, options );

      return new ArrowNode( 0, 0, options.arrowSize, 0, options );
    }

    /**
     * Creates the icon that appears next to the checkbox that toggles the 'Angle' visibility
     * @param {Object} [options]
     * @returns {Node}
     * @public
     */
    static createAngleIcon( options ) {

      options = _.extend( {
        angle: 50, // {number} in degrees
        iconSize: 20, // {number}
        arcRadius: ARC_ARROW_RADIUS, // {number}
        color: VectorAdditionColors.ANGLE_ICON_COLOR, // {string}
        arcArrowOptions: null // {object} see defaults bellow
      }, options );

      options.arcArrowOptions = _.extend( {
        arrowheadWidth: 5, // {number}
        arrowheadHeight: 3, // {number}
        arcOptions: {
          stroke: options.color // {string}
        }
      }, options.arcArrowOptions );

      //----------------------------------------------------------------------------------------

      // Create the Shape for the outline lines of the icon
      const wedgeShape = new Shape();

      const angleIconAngleRadians = Util.toRadians( options.angle );

      // Define the origin at the bottom left (tip of the wedge)
      // Start from right and move to the left (origin) and then move to the top right corner of the wedge
      wedgeShape.moveTo( options.iconSize, 0 )
        .horizontalLineTo( 0 )
        .lineTo( Math.cos( angleIconAngleRadians ) * options.iconSize,
          -1 * Math.sin( angleIconAngleRadians ) * options.iconSize );

      // Create the path for the wedgeShape
      const wedgePath = new Path( wedgeShape, {
        stroke: options.color
      } );

      const arcArrow = new ArcArrowNode( options.angle, options.arcRadius, options.arcArrowOptions );

      return new Node( {
        children: [ wedgePath, arcArrow ]
      } );
    }

    /**
     * Creates the icon that appears next to the checkbox that toggles the Grid visibility
     * @param {Object} [options]
     * @returns {Node}
     * @public
     */
    static createGridIcon( options ) {

      options = _.extend( {
        rows: 3, // {number}
        cols: 3, // {number}
        gridLineSpacing: 6, // {number} spacing between each grid line
        gridPathOptions: null // {object} defaults bellow
      }, options );

      options.gridPathOptions = _.extend( {
        lineWidth: 1, // {number}
        stroke: VectorAdditionColors.GRID_ICON_COLOR // {string}
      }, options.gridPathOptions );

      //----------------------------------------------------------------------------------------

      // Create a shape for the grid
      const gridShape = new Shape();

      // Draw each row
      for ( let row = 0; row < options.rows; row++ ) {
        gridShape.moveTo( 0, row * ( options.gridLineSpacing ) + options.gridLineSpacing )
          .horizontalLineTo( ( options.cols + 1 ) * options.gridLineSpacing );
      }
      // Draw each col
      for ( let col = 0; col < options.cols; col++ ) {
        gridShape.moveTo( col * ( options.gridLineSpacing ) + options.gridLineSpacing, 0 )
          .verticalLineTo( ( options.rows + 1 ) * options.gridLineSpacing );
      }

      return new Path( gridShape, options.gridPathOptions );
    }

    /*---------------------------------------------------------------------------*
     * The Following are icons that appear in the Component Style Radio Buttons
     *---------------------------------------------------------------------------*/
    /**
     * Convenience method to get a component style radio button icon
     * @param {ComponentStyles} componentStyle
     * @param {Object} options
     * @public
     */
    static createComponentStyleIcon( componentStyle, options ) {

      assert && assert( componentStyle && ComponentStyles.includes( componentStyle ),
        `invalid componentStyle: ${componentStyle}` );

      switch( componentStyle ) {
        case ComponentStyles.INVISIBLE:
          return this.createInvisibleComponentStyleIcon( options );
        case ComponentStyles.PARALLELOGRAM:
          return this.createParallelogramComponentStyleIcon( options );
        case ComponentStyles.TRIANGLE:
          return this.createTriangleComponentStyleIcon( options );
        case ComponentStyles.ON_AXIS:
          return this.createOnAxisComponentStyleIcon( options );
        default:
          throw new Error( `invalid componentStyle: ${componentStyle}` );
      }
    }

    /**
     * Creates the Icon for the invisible display style component radio button
     * @param {Object} [options]
     * @public
     */
    static createInvisibleComponentStyleIcon( options ) {
      return new FontAwesomeNode( 'eye_close', _.extend( {
        maxWidth: RADIO_BUTTON_ICON_SIZE + 10
      }, options ) );
    }

    /**
     * Create the Icon for the parallelogram component radio button
     * @param {Object} [options]
     * @public
     */
    static createParallelogramComponentStyleIcon( options ) {

      // The icon has three arrows, a vector arrow and its 2 components (opaque)
      const vectorArrow = new ArrowNode( 0, 0, RADIO_BUTTON_ICON_SIZE, -RADIO_BUTTON_ICON_SIZE, ARROW_ICON_OPTIONS );

      const xComponentArrow = new ArrowNode( 0, 0, RADIO_BUTTON_ICON_SIZE, 0, OPAQUE_ARROW_OPTIONS );

      const yComponentArrow = new ArrowNode( 0, 0, 0, -RADIO_BUTTON_ICON_SIZE, OPAQUE_ARROW_OPTIONS );

      return new Node( _.extend( {
        children: [ xComponentArrow, yComponentArrow, vectorArrow ]
      }, options ) );
    }

    /**
     * Create the Icon for the triangle component radio button
     * @param {Object} [options]
     * @public
     */
    static createTriangleComponentStyleIcon( options ) {

      // The icon has three arrows, a vector arrow and its 2 components (opaque)
      const vectorArrow = new ArrowNode( 0, 0, RADIO_BUTTON_ICON_SIZE, -RADIO_BUTTON_ICON_SIZE, ARROW_ICON_OPTIONS );

      const xComponentArrow = new ArrowNode( 0, 0, RADIO_BUTTON_ICON_SIZE, 0, OPAQUE_ARROW_OPTIONS );

      const yComponentArrow = new ArrowNode(
        RADIO_BUTTON_ICON_SIZE,
        0,
        RADIO_BUTTON_ICON_SIZE,
        -RADIO_BUTTON_ICON_SIZE,
        OPAQUE_ARROW_OPTIONS );

      return new Node( _.extend( {
        children: [ xComponentArrow, yComponentArrow, vectorArrow ]
      }, options ) );
    }

    /**
     * Create the Icon for the on axis component radio button
     * @param {Object} [options]
     * @public
     */
    static createOnAxisComponentStyleIcon( options ) {

      options = _.extend( {
        subBoxSize: 10, // The Icon draws a sub box at the bottom left
        lineDash: [ 2, 2 ], // Line dash
        stroke: 'black'
      }, options );

      //----------------------------------------------------------------------------------------

      // The icon has three arrows, a vector arrow and its 2 components (opaque)
      const vectorArrow = new ArrowNode(
        options.subBoxSize,
        -1 * options.subBoxSize,
        RADIO_BUTTON_ICON_SIZE,
        -1 * RADIO_BUTTON_ICON_SIZE,
        ARROW_ICON_OPTIONS
      );

      const xComponentArrow = new ArrowNode( options.subBoxSize, 0, RADIO_BUTTON_ICON_SIZE, 0, OPAQUE_ARROW_OPTIONS );

      const yComponentArrow = new ArrowNode( 0, -options.subBoxSize, 0, -RADIO_BUTTON_ICON_SIZE, OPAQUE_ARROW_OPTIONS );

      //----------------------------------------------------------------------------------------
      // Create a dashed line shape
      const dashedLineShape = new Shape();

      // Draw the first 2 lines around the sub box
      dashedLineShape.moveTo( 0, -options.subBoxSize )
        .horizontalLineTo( options.subBoxSize )
        .verticalLineToRelative( options.subBoxSize );

      // Draw the lines around the icon
      dashedLineShape.moveTo( 0, -RADIO_BUTTON_ICON_SIZE )
        .horizontalLineTo( RADIO_BUTTON_ICON_SIZE )
        .verticalLineToRelative( RADIO_BUTTON_ICON_SIZE );

      // Create the shape of the path
      const dashedLinePath = new Path( dashedLineShape, options );

      return new Node( {
        children: [ xComponentArrow, yComponentArrow, dashedLinePath, vectorArrow ]
      } );
    }

    /*---------------------------------------------------------------------------*
     * The Following are icons that appear in the Coordinate Snap Modes Radio Buttons
     *---------------------------------------------------------------------------*/
    /**
     * Create the Icon for the cartesian coordinate snap mode radio button
     * @param {Object} [options]
     * @public
     */
    static createCartesianIcon( options ) {

      options = _.extend( {}, ARROW_ICON_OPTIONS, {
        fill: VectorAdditionColors.CARTESIAN_ICON_COLOR,
        tailWidth: 2.5,
        lineWidth: 0
      }, options );

      //----------------------------------------------------------------------------------------

      // The icon has 3 arrows, start with the vector then its 2 components
      const xComponentArrow = new ArrowNode( 0, 0, RADIO_BUTTON_ICON_SIZE, 0, options );

      const yComponentArrow = new ArrowNode(
        RADIO_BUTTON_ICON_SIZE,
        0,
        RADIO_BUTTON_ICON_SIZE,
        -RADIO_BUTTON_ICON_SIZE,
        options );

      const cartesianArrow = new ArrowNode( 0, 0, RADIO_BUTTON_ICON_SIZE, -RADIO_BUTTON_ICON_SIZE, ARROW_ICON_OPTIONS );

      return new Node( {
        children: [ xComponentArrow, yComponentArrow, cartesianArrow ]
      } );
    }

    /**
     * Create the Icon for the cartesian coordinate polar mode radio button
     * @param {Object} [options]
     * @public
     */
    static createPolarIcon( options ) {

      options = _.extend( {}, ARROW_ICON_OPTIONS, {
        fill: VectorAdditionColors.POLAR_ICON_VECTOR_COLOR,
        lineWidth: 0,
        arcRadius: ARC_ARROW_RADIUS,
        arcArrowOptions: null
      }, options );

      options.arcArrowOptions = _.extend( {
        arrowheadWidth: 4, // {number}
        arrowheadHeight: 3, // {number}
        arcOptions: {
          stroke: 'black' // {string}
        }
      }, options.arcArrowOptions );

      // Create an arrow vector
      const arrowVector = new ArrowNode( 0, 0, RADIO_BUTTON_ICON_SIZE, -RADIO_BUTTON_ICON_SIZE, options );

      // Create an arc arrow
      const arcArrow = new ArcArrowNode( 45, options.arcRadius, options.arcArrowOptions );

      // create a baseline
      const line = new Line( 0, 0, RADIO_BUTTON_ICON_SIZE, 0, {
        stroke: 'black'
      } );

      return new Node( {
        children: [ arrowVector, arcArrow, line ]
      } );
    }
  }

  vectorAddition.register( 'VectorAdditionIconFactory', VectorAdditionIconFactory );

  return VectorAdditionIconFactory;

} );
